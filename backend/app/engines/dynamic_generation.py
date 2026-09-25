import json
import logging
from typing import Dict, Any
from app.ai.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

async def generate_dynamic_business_data(
    area_of_interest: str,
    suggested_idea: str,
    detailed_idea: str,
    experience: str,
    district: str,
    state: str,
    capital: float
) -> Dict[str, Any]:
    """
    Dynamically generates the financial baselines and market intelligence for a specific business idea
    using Gemini, completely replacing the static solapur_combined.json dataset.
    """
    prompt = f"""
You are an expert financial modeling AI and business consultant for micro-enterprises in India.
The user wants to start a business with the following details:
- Area of Interest: {area_of_interest}
- Suggested Idea: {suggested_idea}
- Detailed Idea: {detailed_idea}
- Prior Experience: {experience}
- Location: {district}, {state}
- Available Capital: ₹{capital}

Based on realistic market rates in India for this specific micro-enterprise, estimate the baseline financial costs, margins, and market dynamics. 
DO NOT use placeholder data. Provide realistic, well-reasoned estimates for a business of this scale.

Return a JSON object strictly matching this schema:
{{
  "initial_setup_costs": {{ "total_setup_cost": <number> }},
  "pricing_margins": {{ "average_margin_percentage": <number_between_0_and_100>, "pricing_band": {{"lowest": <number>, "highest": <number>}} }},
  "monthly_running_costs": {{ "total_fixed_costs": <number> }},
  "unit_economics": {{
    "expected_monthly_revenue": <number>,
    "variable_costs": <number>,
    "net_operating_income": <number>
  }},
  "competitor_market_data": {{ "competitor_count": <number>, "confidence": "High" }},
  "qualitative_insights": {{
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."],
    "opportunity_gaps": ["...", "..."]
  }},
  "seasonality_and_demand_trend": {{
    "peak_seasons": ["Month1", "Month2"],
    "lean_season": "Month3",
    "demand_growth_trend": "..."
  }},
  "risk_rating": {{ "level": "Medium", "reasoning": "..." }}
}}

Important constraints:
- total_setup_cost should be realistic for the given capital (it can exceed it if they need a loan, but be reasonable for a micro-business).
- net_operating_income MUST equal (expected_monthly_revenue - variable_costs - total_fixed_costs).
"""
    schema = {
        "type": "OBJECT",
        "properties": {
            "initial_setup_costs": {"type": "OBJECT", "properties": {"total_setup_cost": {"type": "NUMBER"}}},
            "pricing_margins": {"type": "OBJECT", "properties": {"average_margin_percentage": {"type": "NUMBER"}, "pricing_band": {"type": "OBJECT", "properties": {"lowest": {"type": "NUMBER"}, "highest": {"type": "NUMBER"}}}}},
            "monthly_running_costs": {"type": "OBJECT", "properties": {"total_fixed_costs": {"type": "NUMBER"}}},
            "unit_economics": {"type": "OBJECT", "properties": {"expected_monthly_revenue": {"type": "NUMBER"}, "variable_costs": {"type": "NUMBER"}, "net_operating_income": {"type": "NUMBER"}}},
            "competitor_market_data": {"type": "OBJECT", "properties": {"competitor_count": {"type": "NUMBER"}, "confidence": {"type": "STRING"}}},
            "qualitative_insights": {"type": "OBJECT", "properties": {"strengths": {"type": "ARRAY", "items": {"type": "STRING"}}, "weaknesses": {"type": "ARRAY", "items": {"type": "STRING"}}, "opportunities": {"type": "ARRAY", "items": {"type": "STRING"}}, "threats": {"type": "ARRAY", "items": {"type": "STRING"}}, "opportunity_gaps": {"type": "ARRAY", "items": {"type": "STRING"}}}},
            "seasonality_and_demand_trend": {"type": "OBJECT", "properties": {"peak_seasons": {"type": "ARRAY", "items": {"type": "STRING"}}, "lean_season": {"type": "STRING"}, "demand_growth_trend": {"type": "STRING"}}},
            "risk_rating": {"type": "OBJECT", "properties": {"level": {"type": "STRING"}, "reasoning": {"type": "STRING"}}}
        },
        "required": ["initial_setup_costs", "pricing_margins", "monthly_running_costs", "unit_economics", "competitor_market_data", "qualitative_insights", "seasonality_and_demand_trend", "risk_rating"]
    }

    try:
        gemini = GeminiClient()
        data = await gemini.generate_json_async(prompt, schema=schema)
        if data is None:
            raise ValueError("Gemini API returned None")
        return data
    except Exception as e:
        logger.error(f"Failed to generate dynamic business data: {e}")
        # Return a safe fallback so the app doesn't crash completely
        return {
            "initial_setup_costs": { "total_setup_cost": capital * 2 if capital > 0 else 100000 },
            "pricing_margins": { "average_margin_percentage": 25, "pricing_band": {"lowest": 100, "highest": 1000} },
            "monthly_running_costs": { "total_fixed_costs": 15000 },
            "unit_economics": {
                "expected_monthly_revenue": 80000,
                "variable_costs": 45000,
                "net_operating_income": 20000
            },
            "competitor_market_data": { "competitor_count": 5, "confidence": "Medium" },
            "qualitative_insights": {
                "strengths": ["Resilient local demand"],
                "weaknesses": ["Capital constraints"],
                "opportunities": ["Digital adoption"],
                "threats": ["Local competition"],
                "opportunity_gaps": ["Better customer service"]
            },
            "seasonality_and_demand_trend": {
                "peak_seasons": ["October", "November"],
                "lean_season": "July",
                "demand_growth_trend": "Stable"
            },
            "risk_rating": { "level": "Medium", "reasoning": "Fallback data used due to AI rate limits." }
        }
