"""
Ranking Service — evaluates all business categories for a location+capital,
returns a ranked list with scores and verdicts. This is the "magic moment."
"""
from app.data_layer.retrieval import DataRetrieval
from app.engines.financial_engine import (
    compute_project_cost, compute_loan_amount, compute_emi,
    compute_dscr, compute_break_even_units, compute_net_profit, compute_roi,
)
from app.engines.scheme_engine import match_scheme
from app.engines.recommendation_engine import compute_yukti_score
from app.engines.market_intelligence import run_full_market_analysis


data_layer = DataRetrieval()


def rank_opportunities(location_id: str, margin_capital: float) -> list[dict]:
    """
    Evaluate every available business category for the given location and capital.
    Returns a ranked list sorted by YUKTI score (descending).
    """
    category_ids = data_layer.get_all_category_ids(location_id)
    if not category_ids:
        return []

    # Category display names
    CATEGORY_NAMES = {
        "dairy": "Dairy",
        "retail_kirana": "Retail / Kirana Store",
        "tailoring": "Tailoring",
        "flour_mill": "Flour Mill",
        "poultry": "Poultry",
    }

    project_cost = compute_project_cost(margin_capital)
    scheme = match_scheme(project_cost)
    scheme_max = scheme.max_loan if scheme.matched else None
    loan_amount = compute_loan_amount(project_cost, scheme_max)

    results = []
    for cat_id in category_ids:
        cat_name = CATEGORY_NAMES.get(cat_id, cat_id)

        # 1. Cost profile
        cost_result = data_layer.get_cost_profile(location_id, cat_id)
        cost = cost_result.get("value")
        cost_confidence = cost_result.get("confidence", "Low")

        if cost is None:
            # Can't evaluate without cost data
            results.append({
                "category_id": cat_id,
                "category_name": cat_name,
                "yukti_score": 0,
                "verdict": "NOT_RECOMMENDED",
                "confidence": "Low",
                "note": "Insufficient cost profile data to evaluate.",
                "highlights": [],
            })
            continue

        # 2. Financial calculations
        monthly_revenue = cost["estimated_monthly_revenue"]
        monthly_opex = cost["fixed_cost_monthly"] + (
            cost["variable_cost_per_unit"] * (cost.get("estimated_monthly_units") or 100)
        )
        net_profit = compute_net_profit(monthly_revenue, monthly_opex)

        if scheme.matched:
            emi = compute_emi(loan_amount, scheme.rate, scheme.tenure_years * 12, scheme.moratorium_months)
        else:
            emi = compute_emi(loan_amount, 10.0, 60, 0)

        dscr = compute_dscr(net_profit, emi)
        roi = compute_roi(net_profit * 12, project_cost)

        try:
            break_even = compute_break_even_units(
                cost["fixed_cost_monthly"],
                cost["selling_price_per_unit"],
                cost["variable_cost_per_unit"],
            )
        except ValueError:
            break_even = 0

        # 3. Market analysis (lightweight — for ranking overview)
        market = run_full_market_analysis(location_id, cat_id, cat_name)
        gap_score = market["opportunity_gaps"].get("gap_score", 50) or 50
        risk_score = market["threats"].get("risk_score", 50)
        competitor_count = market["competitors"]["count"]

        # 4. Dimension scores
        financial_viability = min(100, max(0, roi + 30))  # ROI-based
        repayment_capacity = min(100, max(0, dscr * 50))
        market_opportunity = gap_score
        capital_efficiency = min(100, max(0, 100 - (break_even / 10))) if break_even > 0 else 60
        risk_exposure = max(0, 100 - risk_score)

        dimension_scores = {
            "financial_viability": round(financial_viability),
            "repayment_capacity": round(repayment_capacity),
            "market_opportunity": round(market_opportunity),
            "capital_efficiency": round(capital_efficiency),
            "risk_exposure": round(risk_exposure),
        }

        # 5. Confidence multiplier
        confidence_map = {"High": 1.0, "Medium": 0.85, "Low": 0.65}
        overall_conf = market.get("overall_confidence", "Medium")
        conf_mult = confidence_map.get(overall_conf, 0.75)

        # 6. Score & verdict
        score_result = compute_yukti_score(dimension_scores, conf_mult, dscr)

        # Build highlights
        highlights = []
        if dscr >= 1.5:
            highlights.append(f"Strong repayment capacity (DSCR: {dscr})")
        elif dscr >= 1.0:
            highlights.append(f"Adequate repayment capacity (DSCR: {dscr})")
        else:
            highlights.append(f"Weak repayment capacity (DSCR: {dscr})")

        if competitor_count <= 3:
            highlights.append(f"Low competition ({competitor_count} competitors)")
        if roi > 20:
            highlights.append(f"Good ROI ({roi}%)")

        results.append({
            "category_id": cat_id,
            "category_name": cat_name,
            "yukti_score": score_result.final_score,
            "verdict": score_result.verdict,
            "confidence": overall_conf,
            "dscr": dscr,
            "roi": roi,
            "emi": emi,
            "net_profit": net_profit,
            "dimension_scores": dimension_scores,
            "highlights": highlights,
            "note": f"YUKTI Score: {score_result.final_score}/100",
        })

    # Sort by score descending
    results.sort(key=lambda x: x["yukti_score"], reverse=True)
    return results
