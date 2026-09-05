"""Section 11 — Risk/threat assessment from market and competition data."""


def assess_threats(
    competitor_count: int,
    gap_score: int | None,
    category_name: str,
    pricing: dict | None,
    confidence: str = "Low",
) -> dict:
    """
    Identify key risk factors from structured data.
    """
    risk_factors = []
    risk_score = 50  # neutral baseline

    # Competition risk
    if competitor_count >= 7:
        risk_factors.append({
            "factor": "High competition density",
            "severity": "High",
            "detail": f"{competitor_count} competitors found within 10km for {category_name}.",
        })
        risk_score += 20
    elif competitor_count >= 4:
        risk_factors.append({
            "factor": "Moderate competition",
            "severity": "Medium",
            "detail": f"{competitor_count} competitors in the area.",
        })
        risk_score += 10

    # Pricing risk
    if pricing and pricing.get("value"):
        price_range = pricing["value"]
        spread = price_range.get("high", 0) - price_range.get("low", 0)
        if price_range.get("low", 0) > 0 and spread / price_range["low"] > 2:
            risk_factors.append({
                "factor": "Wide pricing spread",
                "severity": "Medium",
                "detail": "Large variation in market prices — pricing power uncertain.",
            })
            risk_score += 5

    # Market saturation risk
    if gap_score is not None and gap_score < 40:
        risk_factors.append({
            "factor": "Market saturation",
            "severity": "High",
            "detail": "Consumer-to-competitor ratio suggests limited remaining demand.",
        })
        risk_score += 15

    # Data confidence risk
    if confidence == "Low":
        risk_factors.append({
            "factor": "Low data confidence",
            "severity": "Medium",
            "detail": "Risk assessment is based on limited/unverified data.",
        })
        risk_score += 10

    if not risk_factors:
        risk_factors.append({
            "factor": "No major risks identified",
            "severity": "Low",
            "detail": "Based on available data, no significant risk flags detected.",
        })

    # Cap score
    risk_score = min(risk_score, 100)

    return {
        "risk_score": risk_score,
        "risk_factors": risk_factors,
        "confidence": confidence,
        "note": f"Risk score: {risk_score}/100 (higher = riskier).",
    }
