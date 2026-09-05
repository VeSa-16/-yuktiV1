"""Section 11 — Demand vs supply gap analysis."""


def analyze_opportunity_gaps(
    consumer_base: int | None,
    competitor_count: int,
    category_name: str,
    confidence: str = "Low",
) -> dict:
    """
    Determines if there's unmet demand based on consumer-to-competitor ratio.
    """
    if consumer_base is None:
        return {
            "gap_score": None,
            "demand_supply_ratio": None,
            "assessment": "Insufficient data to assess opportunity gaps.",
            "confidence": "Low",
            "note": "Consumer base data unavailable.",
        }

    if competitor_count == 0:
        return {
            "gap_score": 90,
            "demand_supply_ratio": None,
            "assessment": f"No known competitors for {category_name} — significant opportunity if demand exists.",
            "confidence": confidence,
            "note": "Zero competitors found; verify this is not due to lack of data.",
        }

    ratio = consumer_base / competitor_count

    # Scoring heuristic: higher ratio = bigger gap = better opportunity
    if ratio > 5000:
        gap_score = 85
        assessment = f"Strong opportunity — only {competitor_count} competitor(s) serving ~{consumer_base:,} consumers."
    elif ratio > 2000:
        gap_score = 70
        assessment = f"Moderate opportunity — {competitor_count} competitor(s) for ~{consumer_base:,} consumers."
    elif ratio > 500:
        gap_score = 50
        assessment = f"Competitive market — {competitor_count} competitor(s) for ~{consumer_base:,} consumers."
    else:
        gap_score = 30
        assessment = f"Saturated market — {competitor_count} competitor(s) for ~{consumer_base:,} consumers."

    return {
        "gap_score": gap_score,
        "demand_supply_ratio": round(ratio, 0),
        "assessment": assessment,
        "confidence": confidence,
        "note": f"Ratio: {ratio:.0f} consumers per competitor.",
    }
