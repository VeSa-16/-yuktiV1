"""Section 11 — SWOT analysis from market signals using Gemini AI."""


async def generate_swot_async(
    category_name: str,
    competitor_count: int,
    gap_score,
    pricing: dict | None,
    cost_profile: dict | None,
    demographics: dict | None,
    gemini,
    confidence: str = "Low",
    user_context: str = "",
) -> dict:
    prompt = f"""
    Conduct a realistic business SWOT analysis for a '{category_name}' in India.
    {user_context}
    Consider these live facts:
    - Competitors nearby: {competitor_count}
    - Demographic consumer base gap score: {gap_score if gap_score else 'Unknown'}
    - Local demographics: {demographics}
    - Unit Economics (Cost Profile): {cost_profile}
    
    Output ONLY a JSON object exactly matching this schema, with no other text.
    Schema:
    {{
        "strengths": [string],
        "weaknesses": [string],
        "opportunities": [string],
        "threats": [string],
        "note": string (a very short one-sentence summary of the SWOT)
    }}
    """
    result = await gemini.generate_json_async(prompt)
    if result:
        return {
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "opportunities": result.get("opportunities", []),
            "threats": result.get("threats", []),
            "confidence": "High",
            "note": result.get("note", "AI Generated SWOT")
        }

    # Hard fallback
    return {
        "strengths": [f"Government scheme support available for {category_name}."],
        "weaknesses": [f"High competition — {competitor_count} competitors nearby." if competitor_count > 3 else "Limited data available for analysis."],
        "opportunities": ["Explore local demand through a small pilot."],
        "threats": ["General market risk — seasonality, supply chain disruptions."],
        "confidence": confidence,
        "note": "Fallback SWOT (AI unavailable).",
    }


def generate_swot(
    category_name: str,
    competitor_count: int,
    gap_score,
    pricing: dict | None,
    cost_profile: dict | None,
    demographics: dict | None,
    confidence: str = "Low",
) -> dict:
    """Sync fallback for legacy callers."""
    from app.api_clients.gemini_client import GeminiClient
    import asyncio
    client = GeminiClient()
    return asyncio.run(generate_swot_async(category_name, competitor_count, gap_score, pricing, cost_profile, demographics, client, confidence))
