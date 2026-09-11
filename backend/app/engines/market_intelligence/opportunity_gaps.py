"""Section 11 — Demand vs supply gap analysis."""
from typing import Optional


async def analyze_opportunity_gaps_async(
    consumer_base: int | None,
    competitor_count: int,
    category_name: str,
    gemini,
    confidence: str = "Low",
    user_context: str = "",
) -> dict:
    prompt = f"""
    Assess the market opportunity for a '{category_name}' in an Indian locality.
    {user_context}
    - Potential consumer base in radius: {consumer_base}
    - Known competitors in radius: {competitor_count}
    
    Output ONLY a JSON object exactly matching this schema, with no other text.
    Schema:
    {{
        "gap_score": integer (0 to 100, where 100 means massive unmet demand and 0 means oversaturated),
        "demand_supply_ratio": float (consumers per competitor),
        "assessment": string (1-2 sentences evaluating the opportunity),
        "note": string (a short concluding note)
    }}
    """
    result = await gemini.generate_json_async(prompt)
    if result:
        return {
            "gap_score": result.get("gap_score", 50),
            "demand_supply_ratio": result.get("demand_supply_ratio"),
            "assessment": result.get("assessment", "Assessment generated."),
            "confidence": "High",
            "note": result.get("note", "AI Generated Opportunity Analysis.")
        }

    # Hard fallback
    if not consumer_base or competitor_count == 0:
        return {
            "gap_score": 70,
            "demand_supply_ratio": None,
            "assessment": f"No competitor data available for {category_name}.",
            "confidence": confidence,
            "note": "Fallback estimate used."
        }

    ratio = consumer_base / competitor_count
    gap_score = min(100, int((ratio / 2000) * 100))
    if gap_score > 70:
        assessment = f"High demand potential. {int(ratio):,} consumers per competitor."
    elif gap_score > 40:
        assessment = f"Balanced market. {int(ratio):,} consumers per competitor."
    else:
        assessment = f"Saturated market. Only {int(ratio):,} consumers per competitor."

    return {
        "gap_score": gap_score,
        "demand_supply_ratio": round(ratio, 2),
        "assessment": assessment,
        "confidence": confidence,
        "note": "Calculated deterministically (AI unavailable)."
    }


def analyze_opportunity_gaps(
    consumer_base: int | None,
    competitor_count: int,
    category_name: str,
    confidence: str = "Low",
) -> dict:
    """Sync fallback for legacy callers."""
    from app.ai.gemini_client import GeminiClient
    import asyncio
    client = GeminiClient()
    return asyncio.run(analyze_opportunity_gaps_async(consumer_base, competitor_count, category_name, client, confidence))
