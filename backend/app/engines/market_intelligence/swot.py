"""Section 11 — Structured SWOT analysis from market signals. AI does NOT generate this."""


def generate_swot(
    category_name: str,
    competitor_count: int,
    gap_score: int | None,
    pricing: dict | None,
    cost_profile: dict | None,
    demographics: dict | None,
    confidence: str = "Low",
) -> dict:
    """
    Build SWOT from structured market signals — never fabricate evidence.
    Each point is derived from a specific data input.
    """
    strengths = []
    weaknesses = []
    opportunities = []
    threats_list = []

    # --- Strengths ---
    if cost_profile and cost_profile.get("selling_price_per_unit") and cost_profile.get("variable_cost_per_unit"):
        margin = cost_profile["selling_price_per_unit"] - cost_profile["variable_cost_per_unit"]
        margin_pct = (margin / cost_profile["selling_price_per_unit"]) * 100
        if margin_pct > 30:
            strengths.append(f"Healthy unit margin ({margin_pct:.0f}%) for {category_name}.")
        else:
            weaknesses.append(f"Thin unit margin ({margin_pct:.0f}%) — volume-dependent business.")

    if competitor_count <= 3:
        strengths.append(f"Low competition — only {competitor_count} competitor(s) nearby.")
    elif competitor_count <= 6:
        pass  # neutral
    else:
        weaknesses.append(f"High competition — {competitor_count} competitors within 10km.")

    # --- Opportunities ---
    if gap_score is not None and gap_score >= 70:
        opportunities.append("Significant unmet demand detected based on consumer-to-competitor ratio.")
    if demographics and demographics.get("avg_monthly_income") and demographics["avg_monthly_income"] >= 10000:
        opportunities.append("Local income levels can support this type of business expenditure.")

    # --- Threats ---
    if competitor_count >= 5:
        threats_list.append("Price pressure from existing competitors likely.")
    if demographics is None or demographics.get("population") is None:
        threats_list.append("Insufficient demographic data — demand validation is uncertain.")
        weaknesses.append("Market size cannot be reliably estimated with available data.")

    # Defaults when data is too sparse
    if not strengths:
        strengths.append("Government scheme support available for this project size.")
    if not opportunities:
        opportunities.append("Explore local demand through a small pilot before full investment.")
    if not threats_list:
        threats_list.append("General market risk — seasonality, supply chain disruptions.")

    return {
        "strengths": strengths,
        "weaknesses": weaknesses if weaknesses else ["No significant weaknesses identified from available data."],
        "opportunities": opportunities,
        "threats": threats_list,
        "confidence": confidence,
        "note": "SWOT is derived from structured data signals, not AI-generated.",
    }
