"""
POST /api/analysis/generate
Purpose: Authoritative analysis after onboarding.
DO NOT call this from Discover tab — use /rank-opportunities for pre-onboarding discovery.
"""
import logging
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from app.core.security import limiter, get_api_key

from app.data_layer.retrieval import DataRetrieval
from app.ai_layer.business_matcher import match_business_category, ALLOWED_CATEGORIES
from app.engines.financial_engine import run_financial_engine
from app.engines.scoring_engine import compute_all_dimensions, generate_verdict, generate_next_steps, compute_evidence_coverage
from app.schemas.evidence import EvidenceRecord, ConfidenceLevelEnum
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
@limiter.limit("5/minute")
async def generate_analysis(request: Request, req: AnalysisRequest, api_key: str = Depends(get_api_key)):
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
        # Check if the location is out of coverage
        if district and "solapur" not in district.lower() and "mh_sol" not in district.lower():
            logger.error("[ANALYSIS] Location '%s' is out of demo coverage", district)
            raise HTTPException(status_code=400, detail="OUT_OF_COVERAGE")
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

    import copy
    financial_setup = copy.deepcopy(financial_setup)
    financial_margin = copy.deepcopy(financial_margin)
    financial_costs = copy.deepcopy(financial_costs)
    unit_economics = copy.deepcopy(unit_economics)

    # Apply Simulation What-If Scenario if provided
    if getattr(req, "mode", None) == "simulation" and getattr(req, "scenario", None):
        demand_mult = req.scenario.get("demand_multiplier", 1.0)
        cost_mult = req.scenario.get("cost_multiplier", 1.0)
        price_mult = req.scenario.get("price_multiplier", 1.0)
        
        if "expected_monthly_revenue" in unit_economics:
            unit_economics["expected_monthly_revenue"] *= (demand_mult * price_mult)
        if "variable_costs" in unit_economics:
            unit_economics["variable_costs"] *= (demand_mult * cost_mult)
        if "total_fixed_costs" in financial_costs:
            financial_costs["total_fixed_costs"] *= cost_mult
        
        # Recalculate NOI based on modified values
        rev = unit_economics.get("expected_monthly_revenue", 0)
        vc = unit_economics.get("variable_costs", 0)
        fc = financial_costs.get("total_fixed_costs", 0)
        unit_economics["net_operating_income"] = rev - vc - fc
        
        logger.info(f"[SIMULATION] Applied multipliers: demand={demand_mult}, cost={cost_mult}, price={price_mult}")

    fin_result = run_financial_engine(
        user_capital=user_capital,
        setup_costs=financial_setup,
        pricing_margins=financial_margin,
        monthly_costs=financial_costs,
        unit_economics=unit_economics,
        category_id=category_id,
        user_profile=req.profile,
    )

    logger.info(
        "[FINANCIAL] project_cost=%s emi=%s DSCR=%s ROI=%s%%",
        fin_result.get("project_cost", "ERR"),
        fin_result.get("emi", "ERR"),
        fin_result.get("dscr", "ERR"),
        fin_result.get("roi_pct", "ERR")
    )

    # ── 5. SCORE ENGINE (data-driven, no hardcoded constants) ─────────────────
    comp_count_source = "static_dataset"
    comp_count  = int(market_data.get("competitor_count", 0))

    # Overpass live lookup
    loc = req.location or {}
    village = loc.get('village_or_taluka') or ''
    dist = loc.get('district') or ''
    st = loc.get('state') or ''
    location_str = f"{village} {dist} {st}".strip()
    
    if location_str:
        from app.api_clients.geocoding_client import geocode_location
        from app.api_clients.overpass_client import query_competitors
        
        coords = await geocode_location(location_str)
        if coords:
            live_count = await query_competitors(coords[0], coords[1], 5.0, category_id)
            if live_count is not None:
                comp_count = live_count
                comp_count_source = "live_osm"
                logger.info(f"[OVERPASS] Retrieved live competitor count: {comp_count}")

    from app.engines.demand_model import estimate_consumer_base
    demand_data = estimate_consumer_base(village, dist)
    population = demand_data["local_consumer_base_5km"]

    risk_level  = risk_rating.get("level", "Medium")
    threats     = qualitative.get("threats", [])

    if fin_result.get("financial_data_available"):
        evidence_list = []
        market_conf = market_data.get("confidence", "Medium").upper()
        if market_conf not in ["HIGH", "MEDIUM", "LOW"]: market_conf = "MEDIUM"
        
        evidence_list.append(EvidenceRecord(
            metric="Market Opportunity",
            value=f"Pop: {population}, Comp: {comp_count}",
            source="solapur_combined.json",
            geography=district,
            resolution="district" if comp_count_source == "static_dataset" else "5km_radius",
            method="direct lookup" if comp_count_source == "static_dataset" else "live query",
            confidence=ConfidenceLevelEnum(market_conf),
            coverage_pct=100.0 if population > 0 else 0.0,
            data_source=comp_count_source
        ).dict())
        
        evidence_list.append(EvidenceRecord(
            metric="Financial Viability",
            value=f"ROI: {fin_result.get('roi_pct', 0)}%, DSCR: {fin_result.get('dscr', 0)}",
            source="financial_engine.py",
            geography=district,
            resolution="district",
            method="derived estimate",
            confidence=ConfidenceLevelEnum("HIGH"),
            coverage_pct=100.0
        ).dict())
        
        cov_result = compute_evidence_coverage(evidence_list)
        overall_confidence = cov_result["overall_confidence"]
        coverage_pct = cov_result["coverage_pct"]

        scores = compute_all_dimensions(
            roi=fin_result["roi_pct"],
            dscr=fin_result["dscr"],
            net_margin=fin_result["gross_margin_pct"],
            break_even_units=fin_result.get("break_even_monthly_revenue") or 0,
            monthly_units=fin_result.get("monthly_revenue") or 1,
            competitor_count=comp_count,
            population=population,
            overall_confidence=overall_confidence,
            threats_count=len(threats),
            experience=req.business.experience if req.business and hasattr(req.business, "experience") else "None",
        )
        total_score = round(sum(scores.values()) / len(scores)) if scores else None
        verdict = generate_verdict(total_score, coverage_pct, language=req.language) if total_score is not None else None
        next_steps = generate_next_steps(scores, fin_result, market_data, language=req.language) if scores else []
    else:
        scores = None
        total_score = None
        verdict = None
        next_steps = []
        evidence_list = []
        coverage_pct = 0.0
        overall_confidence = "LOW"

    logger.info("[SCORE] overall=%s dimensions=%s", total_score, scores)

    # ── 5.5 ALTERNATIVES EVALUATION (Step 3) ─────────────────────────────────
    alternatives = []
    if req.business.get("compare_alternatives"):
        ALT_MAP = {
            "retail_shop": ["food_beverage", "logistics_delivery"],
            "manufacturing": ["agri_business", "handicrafts_artisanal"],
            "agri_business": ["food_beverage", "manufacturing"],
            "services_tech": ["education_training", "retail_shop"],
            "food_beverage": ["retail_shop", "agri_business"],
            "handicrafts_artisanal": ["fashion_apparel", "manufacturing"],
            "logistics_delivery": ["services_tech", "retail_shop"],
            "education_training": ["services_tech", "healthcare_wellness"],
            "healthcare_wellness": ["education_training", "services_tech"],
            "fashion_apparel": ["handicrafts_artisanal", "retail_shop"],
        }
        alt_cats = ALT_MAP.get(category_id, ["retail_shop", "food_beverage"])
        for acat in alt_cats:
            if acat == category_id: continue
            acat_data = retrieval.get_category_data(district, acat)
            if not acat_data: continue
            
            afin_res = run_financial_engine(
                user_capital=user_capital,
                setup_costs=acat_data.get("initial_setup_costs", {}),
                pricing_margins=acat_data.get("pricing_margins", {}),
                monthly_costs=acat_data.get("monthly_running_costs", {}),
                unit_economics=acat_data.get("unit_economics", {}),
                category_id=acat,
                user_profile=req.profile,
            )
            
            amkt_data = acat_data.get("competitor_market_data", {})
            acomp_count = int(amkt_data.get("competitor_count", 0))
            apop = amkt_data.get("market_reach", {}).get("estimated_target_customer_base") or 0
            
            ascores = compute_all_dimensions(
                roi=afin_res["roi_pct"],
                dscr=afin_res["dscr"],
                net_margin=afin_res["gross_margin_pct"],
                break_even_units=afin_res.get("break_even_monthly_revenue") or 0,
                monthly_units=afin_res.get("monthly_revenue") or 1,
                competitor_count=acomp_count,
                population=apop,
                overall_confidence="HIGH",
                threats_count=0,
                experience=req.business.experience if req.business and hasattr(req.business, "experience") else "None",
            )
            atotal = round(sum(ascores.values()) / len(ascores)) if ascores else 0
            
            alternatives.append({
                "category_id": acat,
                "score": atotal,
                "dscr": afin_res.get("dscr", 0),
                "roi_pct": afin_res.get("roi_pct", 0)
            })


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
    from app.engines.action_plan_engine import generate_action_plan
    action_plan = generate_action_plan(
        category_id=category_id,
        category_name=category_data.get("subcategory", "Business"),
        location_name=district,
        stage=req.business.get("stage", "Startup"),
        business_name=req.business.get("name", "Your Business")
    )

    from app.engines.pricing_engine import compute_adjusted_pricing
    base_pricing_band = category_data.get("pricing_margins", {}).get("pricing_band", {})
    base_low = float(base_pricing_band.get("lowest", 0))
    base_high = float(base_pricing_band.get("highest", 0))
    pricing_intelligence = compute_adjusted_pricing(
        base_low=base_low, 
        base_high=base_high, 
        location_str=district, 
        competitor_count=comp_count, 
        language=req.language
    )

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
            "target_customer_base_10km": demand_data.get("local_consumer_base_10km"),
            "demand_model_density": demand_data.get("model_density"),
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
            "evidence": evidence_list,
            "coverage_pct": coverage_pct,
            "confidence": overall_confidence
        } if total_score is not None else None,

        "risk": {
            "level": risk_level,
            "reasoning": risk_rating.get("reasoning", ""),
            "threats": qualitative.get("threats", []),
        },

        "alternatives": alternatives,

        "ai_insights": ai_insights,

        "pricing_intelligence": pricing_intelligence,

        "action_plan": action_plan,

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
