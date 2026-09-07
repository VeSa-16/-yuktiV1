"""Section 15 — recalculation chain for the What-If Simulator."""
from app.engines.financial_engine import compute_emi, compute_dscr, compute_net_profit, compute_roi
from app.engines.recommendation_engine import compute_yukti_score, band_verdict

DSCR_STRESS_GATE = 1.0   # minimum dscr to be considered viable


def run_simulation(
    base_state: dict,
    revenue_delta_pct: float,
    cost_delta_pct: float,
    tenure_override_years: int | None,
) -> dict:
    """
    base_state must contain: principal, rate, tenure_months, moratorium_months,
    monthly_revenue, monthly_opex, dimension_scores, confidence_multiplier.

    Returns enriched dict including simulated_roi and survives_stress.
    """
    tenure_months = (tenure_override_years * 12) if tenure_override_years else base_state["tenure_months"]

    emi = compute_emi(
        base_state["principal"], base_state["rate"], tenure_months, base_state["moratorium_months"]
    )
    new_revenue = base_state["monthly_revenue"] * (1 + revenue_delta_pct / 100)
    new_opex = base_state["monthly_opex"] * (1 + cost_delta_pct / 100)
    net_profit = compute_net_profit(new_revenue, new_opex)
    dscr = compute_dscr(net_profit, emi)

    # Derive simulated annualised ROI using the same project cost logic
    # project_cost = principal / 0.90 (inverse of the financing percentage)
    project_cost = base_state["principal"] / 0.90
    simulated_roi = compute_roi(net_profit * 12, project_cost)

    score = compute_yukti_score(base_state["dimension_scores"], base_state["confidence_multiplier"], dscr)

    return {
        "emi": emi,
        "dscr": dscr,
        "net_profit": net_profit,
        "verdict": score.verdict,
        "final_score": score.final_score,
        "simulated_roi": simulated_roi,
        "survives_stress": dscr >= DSCR_STRESS_GATE,
    }
