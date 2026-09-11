"""Section 11 — Risk/threat assessment using Gemini AI."""


async def assess_threats_async(
    competitor_count: int,
    gap_score,
    category_name: str,
    pricing: dict | None,
    gemini,
    confidence: str = "Low",
    user_context: str = "",
) -> dict:
    prompt = f"""
    Assess business threats and risks for a '{category_name}' in India.
    {user_context}
    - Competitor Count: {competitor_count}
    - Opportunity Gap Score: {gap_score if gap_score is not None else 'Unknown'}
    - Pricing Data: {pricing}
    
    Output ONLY a JSON object exactly matching this schema, with no other text.
    Schema:
    {{
        "risk_score": integer (0 to 100, where 100 is extremely risky),
        "risk_factors": [
            {{
                "factor": string (name of risk),
                "severity": string ('Low', 'Medium', or 'High'),
                "detail": string (explanation)
            }}
        ],
        "note": string (short summary note)
    }}
    """
    result = await gemini.generate_json_async(prompt)
    if result:
        return {
            "risk_score": result.get("risk_score", 50),
            "risk_factors": result.get("risk_factors", []),
            "confidence": "High",
            "note": result.get("note", "AI Generated Threat Assessment")
        }

    # Hard fallback
    risk_factors = []
    risk_score = 50
    if competitor_count >= 7:
        risk_factors.append({
            "factor": "High competition density",
            "severity": "High",
            "detail": f"{competitor_count} competitors found.",
        })
        risk_score += 20
    if not risk_factors:
        risk_factors.append({
            "factor": "No major risks identified",
            "severity": "Low",
            "detail": "Based on available data, no significant risk flags detected.",
        })
    return {
        "risk_score": min(risk_score, 100),
        "risk_factors": risk_factors,
        "confidence": confidence,
        "note": "Fallback threat assessment (AI unavailable).",
    }


def assess_threats(
    competitor_count: int,
    gap_score,
    category_name: str,
    pricing: dict | None,
    confidence: str = "Low",
) -> dict:
    """Sync fallback for legacy callers."""
    from app.ai.gemini_client import GeminiClient
    import asyncio
    client = GeminiClient()
    return asyncio.run(assess_threats_async(competitor_count, gap_score, category_name, pricing, client, confidence))
