"""
POST /api/analysis/generate
Purpose: Authoritative analysis after onboarding.
DO NOT call this from Discover tab — use /rank-opportunities for pre-onboarding discovery.
"""
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from app.data_layer.retrieval import DataRetrieval
from app.ai_layer.business_matcher import match_business_category, ALLOWED_CATEGORIES
from app.engines.financial_engine import run_financial_engine
from app.engines.scoring_engine import compute_all_dimensions, generate_verdict, generate_next_steps
from app.ai.gemini_client import GeminiClient

router = APIRouter()
logger = logging.getLogger(__name__)


class AnalysisRequest(BaseModel):
    profile: Dict[str, Any]
    location: Dict[str, Any]
    capital: Dict[str, Any]
    business: Dict[str, Any]
    mode: Optional[str] = "analysis"  # "analysis" or "simulation"
    scenario: Optional[Dict[str, Any]] = None
    language: Optional[str] = "en"


@router.post("/generate")
async def generate_analysis(req: AnalysisRequest):
    """
    Unified endpoint that takes onboarding input, matches it to the JSON dataset,
    runs deterministic engines, and asks Gemini to provide qualitative insights.
    Gemini failure does NOT destroy the deterministic analysis.
    """

    # ── 1. STRICT LOCATION CHECK ────────────────────────────────────────────
    district = req.location.get("district", "").strip()
    district_lower = district.lower()

    logger.info("[ANALYSIS] Location check: district='%s'", district)

    if "solapur" not in district_lower:
        logger.warning("[ANALYSIS] Unsupported location: %s — returning data_available=false", district)
        return {
            "status": "success",
            "data_available": False,
            "analysis_status": "limited",
            "location": {
                "requested": district,
                "resolved": district,
                "data_available": False,
                "data_scope": "solapur_only",
                "coverage_message": (
                    "Detailed market intelligence is currently available for Solapur. "
                    "No data for the selected location."
                )
            },
            "matched_business": None,
            "market": None,
            "financials": None,
            "scores": None,
            "ai_insights": None
        }

    # ── 2. BUSINESS CATEGORY MATCHING ────────────────────────────────────────
    area_of_interest = req.business.get("area_of_interest", "")
    suggested_idea   = req.business.get("suggested_idea", "")
    detailed_idea    = req.business.get("detailed_idea_description", "")
    prior_experience = req.business.get("prior_experience", "Beginner")

    logger.info(
        "[ANALYSIS] Matching category: area='%s' idea='%s' experience='%s'",
        area_of_interest, suggested_idea[:40], prior_experience
    )

    matcher_result = await match_business_category(
        area_of_interest=area_of_interest,
        suggested_idea=suggested_idea,
        detailed_idea=detailed_idea,
        experience=prior_experience,
    )
    category_id = matcher_result.get("matched_category_id", "retail_shop")

    logger.info("[ANALYSIS] Matched category: %s (confidence=%.2f)", category_id, matcher_result.get("confidence", 0))

    # ── 3. RETRIEVE REAL JSON DATA ────────────────────────────────────────────
    retrieval = DataRetrieval()
    category_data  = retrieval.get_category_data(district, category_id)

    if not category_data:
        logger.error("[ANALYSIS] Category '%s' not found in dataset", category_id)
        raise HTTPException(status_code=404, detail=f"Category '{category_id}' not found in dataset")

    # Explicitly pull the four sections the financial engine needs
    financial_setup  = category_data.get("initial_setup_costs", {})
    financial_margin = category_data.get("pricing_margins", {})
    financial_costs  = category_data.get("monthly_running_costs", {})
    unit_economics   = category_data.get("unit_economics", {})
    market_data      = category_data.get("competitor_market_data", {})
    qualitative      = category_data.get("qualitative_insights", {})
    seasonality      = category_data.get("seasonality_and_demand_trend", {})
    risk_rating      = category_data.get("risk_rating", {})

    logger.info(
        "[ANALYSIS] Dataset loaded: category=%s competitors=%s revenue=%s",
        category_id,
        market_data.get("competitor_count", "?"),
        unit_economics.get("expected_monthly_revenue", "?")
    )

    # ── 4. FINANCIAL ENGINE (deterministic Python math) ───────────────────────
    raw_capital = req.capital.get("investment_amount", 0)
    try:
        user_capital = float(raw_capital)
    except (ValueError, TypeError):
        user_capital = 0.0

    if user_capital <= 0:
        logger.warning("[FINANCIAL] investment_amount is zero or missing — got: %s", raw_capital)

    logger.info("[FINANCIAL] investment_amount=%.0f", user_capital)

    fin_result = run_financial_engine(
        user_capital=user_capital,
        setup_costs=financial_setup,
        pricing_margins=financial_margin,
        monthly_costs=financial_costs,
        unit_economics=unit_economics,
        category_id=category_id,
    )

    logger.info(
        "[FINANCIAL] project_cost=%s emi=%s DSCR=%s ROI=%s%%",
        fin_result.get("project_cost", "ERR"),
        fin_result.get("emi", "ERR"),
        fin_result.get("dscr", "ERR"),
        fin_result.get("roi_pct", "ERR")
    )

    # ── 5. SCORE ENGINE (data-driven, no hardcoded constants) ─────────────────
    comp_count  = int(market_data.get("competitor_count", 0))
    population  = (
        market_data.get("market_reach", {}).get("estimated_target_customer_base") or 0
    )
    risk_level  = risk_rating.get("level", "Medium")
    threats     = qualitative.get("threats", [])

    if fin_result.get("financial_data_available"):
        scores = compute_all_dimensions(
            roi=fin_result["roi_pct"],
            dscr=fin_result["dscr"],
            net_margin=fin_result["gross_margin_pct"],
            break_even_units=fin_result.get("break_even_monthly_revenue") or 0,
            monthly_units=fin_result.get("monthly_revenue") or 1,
            competitor_count=comp_count,
            population=population,
            overall_confidence=market_data.get("confidence", "Medium"),
            threats_count=len(threats),
        )
        total_score = round(sum(scores.values()) / len(scores)) if scores else None
        verdict = generate_verdict(total_score) if total_score is not None else None
        next_steps = generate_next_steps(scores, fin_result, market_data) if scores else []
    else:
        scores = None
        total_score = None
        verdict = None
        next_steps = []

    logger.info("[SCORE] overall=%s dimensions=%s", total_score, scores)

    # ── 6. GEMINI REASONING (supplementary — failure does NOT halt analysis) ──
    ai_insights = None
    try:
        gemini = GeminiClient()

        # Build compact context (Step 19 — do NOT dump raw JSON)
        gemini_context = {
            "user": {
                "name": req.profile.get("name", "Entrepreneur"),
                "experience": prior_experience,
            },
            "location": {"district": district, "state": req.location.get("state", "")},
            "business": {
                "category": category_id,
                "subcategory": matcher_result.get("matched_subcategory", ""),
                "area_of_interest": area_of_interest,
                "idea": suggested_idea or detailed_idea,
            },
            "financials": {
                "project_cost": fin_result.get("project_cost"),
                "loan_amount": fin_result.get("loan_amount"),
                "emi": fin_result.get("emi"),
                "net_profit_monthly": fin_result.get("net_profit"),
                "roi_pct": fin_result.get("roi_pct"),
                "dscr": fin_result.get("dscr"),
                "capital_sufficient": fin_result.get("capital_sufficient"),
            } if fin_result.get("financial_data_available") else None,
            "market": {
                "competitor_count": comp_count,
                "target_customer_base": population,
                "risk_level": risk_level,
                "opportunity_gaps": qualitative.get("opportunity_gaps", [])[:2],
                "strengths": qualitative.get("strengths", [])[:2],
                "threats": qualitative.get("threats", [])[:2],
            },
            "score": total_score,
        }

        prompt = f"""
You are an expert business advisor for YuktiFi, helping a first-generation entrepreneur in India.
Below is the deterministic analysis output from YuktiFi's engines. 
Your job is to EXPLAIN and INTERPRET these numbers — do NOT invent new numbers.

CONTEXT:
{gemini_context}

Provide:
1. A 2-sentence "rationale" explaining the business score and outlook based on the numbers above.
2. 3 specific, actionable "recommendations" (1 sentence each) grounded in the context above.

IMPORTANT INSTRUCTION ON LANGUAGE:
Respond ENTIRELY in {'Hindi (Devanagari script)' if req.language == 'hi' else 'English'}.
Translate the rationale and recommendations completely into {'Hindi' if req.language == 'hi' else 'English'}.

IMPORTANT: Do not hallucinate numbers. Only reference values that appear in the context.
Return strict JSON: {{"rationale": "...", "recommendations": ["...", "...", "..."]}}
        """

        schema = {
            "type": "OBJECT",
            "properties": {
                "rationale": {"type": "STRING"},
                "recommendations": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                }
            },
            "required": ["rationale", "recommendations"]
        }

        ai_insights = await gemini.generate_json_async(prompt, schema=schema)
        logger.info("[GEMINI] AI insights generated successfully")

    except Exception as e:
        # Step 22 — Gemini failure is non-fatal
        logger.warning("[GEMINI] Failed to generate AI insights: %s", str(e))
        ai_insights = None

    if not ai_insights:
        ai_insights = {
            "rationale": "AI explanation temporarily unavailable. The deterministic analysis based on actual market data is provided below." if req.language != 'hi' else "एआई स्पष्टीकरण अस्थायी रूप से अनुपलब्ध है। वास्तविक बाजार डेटा पर आधारित नियतात्मक विश्लेषण नीचे दिया गया है।",
            "recommendations": [],
            "ai_available": False
        }
    else:
        ai_insights["ai_available"] = True

    # ── 7. CONSTRUCT FINAL UNIFIED PAYLOAD ────────────────────────────────────
    response = {
        "status": "success",
        "mode": req.mode,
        "data_available": True,
        "analysis_status": "complete",

        "location": {
            "state": req.location.get("state", ""),
            "district": district,
            "village_or_taluka": req.location.get("village_or_taluka", ""),
            "data_available": True,
            "data_scope": "solapur_dataset_v1",
        },

        "profile": {
            "name": req.profile.get("name", "Entrepreneur"),
            "age": req.profile.get("age"),
            "gender": req.profile.get("gender", ""),
            "social_category": req.profile.get("social_category", ""),
            "experience": prior_experience,
        },

        "business": {
            "area_of_interest": area_of_interest,
            "matched_category_id": category_id,
            "matched_subcategory": matcher_result.get("matched_subcategory", ""),
            "suggested_idea": suggested_idea,
            "detailed_description": detailed_idea,
            "confidence": matcher_result.get("confidence", 0),
            "reason": matcher_result.get("reason", ""),
        },

        "market": {
            "competitor_count": comp_count,
            "competitors": market_data.get("competitor_list", []),
            "daily_footfall": market_data.get("daily_footfall"),
            "target_customer_base": population,
            "pricing_band": category_data.get("pricing_margins", {}).get("pricing_band", {}),
            "average_margin_pct": category_data.get("pricing_margins", {}).get("average_margin_percentage"),
            "confidence": market_data.get("confidence", "Medium"),
            "derived_metrics": market_data.get("derived_metrics", {}),
            "opportunity_gaps": qualitative.get("opportunity_gaps", []),
            "strengths": qualitative.get("strengths", []),
            "weaknesses": qualitative.get("weaknesses", []),
            "opportunities": qualitative.get("opportunities", []),
            "threats": qualitative.get("threats", []),
            "peak_seasons": seasonality.get("peak_seasons", []),
            "lean_season": seasonality.get("lean_season", ""),
            "demand_trend": seasonality.get("demand_growth_trend", ""),
        },

        "financials": fin_result,

        "scores": {
            "overall": total_score,
            "dimensions": scores,
            "verdict": verdict,
            "next_steps": next_steps,
        } if total_score is not None else None,

        "risk": {
            "level": risk_level,
            "reasoning": risk_rating.get("reasoning", ""),
            "threats": qualitative.get("threats", []),
        },

        "ai_insights": ai_insights,

        "provenance": [
            {"field": "market", "source": "solapur_combined.json", "source_type": "dataset", "confidence": market_data.get("confidence", "Medium")},
            {"field": "financials", "source": "solapur_combined.json + python_engine", "source_type": "calculated", "confidence": "High" if fin_result.get("financial_data_available") else "unavailable"},
            {"field": "scores", "source": "scoring_engine.py", "source_type": "calculated", "confidence": "High" if total_score is not None else "unavailable"},
            {"field": "ai_insights", "source": "gemini_2.5", "source_type": "ai", "confidence": "Medium" if ai_insights.get("ai_available") else "unavailable"},
        ]
    }

    logger.info(
        "[ANALYSIS] Complete. category=%s score=%s financial_available=%s ai_available=%s",
        category_id, total_score,
        fin_result.get("financial_data_available"),
        ai_insights.get("ai_available")
    )

    return response
