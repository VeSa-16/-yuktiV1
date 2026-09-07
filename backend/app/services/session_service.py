"""
Session Service — manages user sessions and builds base_state for simulation.
Orchestrates API → Service → Engine flow.
"""
from sqlalchemy.orm import Session as DBSession
from app.models import Session, Location, BusinessCategory, LoanProduct, FinancialProjection
from app.models.core import uid
from app.data_layer.retrieval import DataRetrieval
from app.engines.financial_engine import (
    compute_project_cost, compute_loan_amount, compute_emi,
    compute_dscr, compute_break_even_units, compute_net_profit, compute_roi,
)
from app.engines.scheme_engine import match_scheme
from app.engines.scoring_engine import compute_all_dimensions
from app.engines.market_intelligence import run_full_market_analysis

data_layer = DataRetrieval()


def create_session(
    db: DBSession,
    user_id: str,
    location_id: str,
    margin_capital: float,
    category_id: str | None = None,
) -> Session:
    """Create a new session and return it."""
    session = Session(
        id=uid(),
        user_id=user_id,
        location_id=location_id,
        margin_capital=margin_capital,
        category_id=category_id,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def update_session_category(db: DBSession, session_id: str, category_id: str) -> Session:
    """Update the selected business category for a session."""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise ValueError(f"Session {session_id} not found")
    session.category_id = category_id
    db.commit()
    db.refresh(session)
    return session


def compute_full_financials(
    db: DBSession,
    session_id: str,
) -> dict:
    """
    Compute the full financial snapshot for a session — project cost, loan,
    EMI, DSCR, break-even, net profit, ROI. Stores results in DB.
    """
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise ValueError(f"Session {session_id} not found")

    location_id = session.location_id
    category_id = session.category_id
    margin_capital = session.margin_capital

    # 1. Project cost & loan
    project_cost = compute_project_cost(margin_capital)
    scheme = match_scheme(project_cost)
    scheme_max = scheme.max_loan if scheme.matched else None
    loan_amount = compute_loan_amount(project_cost, scheme_max)
    contribution = project_cost - loan_amount

    # Store loan product
    loan = LoanProduct(
        id=uid(),
        session_id=session_id,
        project_cost=project_cost,
        loan_amount=loan_amount,
        beneficiary_contribution=contribution,
        matched_scheme_id=None,  # not linking to DB scheme row for now
    )
    db.add(loan)

    # 2. Cost profile for financial calcs
    cost_result = data_layer.get_cost_profile(location_id, category_id) if category_id else {"value": None}
    cost = cost_result.get("value")

    if cost is None:
        # Fallback: use generic estimates
        monthly_revenue = margin_capital * 0.5
        monthly_opex = margin_capital * 0.35
        fixed_costs = margin_capital * 0.1
        variable_cost = 50
        selling_price = 100
    else:
        monthly_revenue = cost["estimated_monthly_revenue"]
        monthly_opex = cost["fixed_cost_monthly"] + (
            cost["variable_cost_per_unit"] * (cost.get("estimated_monthly_units") or 100)
        )
        fixed_costs = cost["fixed_cost_monthly"]
        variable_cost = cost["variable_cost_per_unit"]
        selling_price = cost["selling_price_per_unit"]

    # 3. EMI
    if scheme.matched:
        emi = compute_emi(
            loan_amount,
            scheme.rate,
            scheme.tenure_years * 12,
            scheme.moratorium_months,
        )
        rate = scheme.rate
        tenure_months = scheme.tenure_years * 12
        moratorium_months = scheme.moratorium_months
    else:
        emi = compute_emi(loan_amount, 10.0, 60, 0)  # generic fallback
        rate = 10.0
        tenure_months = 60
        moratorium_months = 0

    # 4. Financial metrics
    net_profit = compute_net_profit(monthly_revenue, monthly_opex)
    dscr = compute_dscr(net_profit, emi)

    try:
        break_even = compute_break_even_units(fixed_costs, selling_price, variable_cost)
    except ValueError:
        break_even = 0.0

    roi = compute_roi(net_profit * 12, project_cost)

    # Store projection
    projection = FinancialProjection(
        id=uid(),
        session_id=session_id,
        monthly_revenue=monthly_revenue,
        monthly_opex=monthly_opex,
        net_profit=net_profit,
        break_even_units=break_even,
        dscr=dscr,
        roi=roi,
    )
    db.add(projection)
    db.commit()

    return {
        "project_cost": project_cost,
        "loan_amount": loan_amount,
        "beneficiary_contribution": contribution,
        "scheme": scheme.__dict__,
        "emi": emi,
        "rate": rate,
        "tenure_months": tenure_months,
        "moratorium_months": moratorium_months,
        "monthly_revenue": monthly_revenue,
        "monthly_opex": monthly_opex,
        "net_profit": net_profit,
        "dscr": dscr,
        "break_even_units": break_even,
        "roi": roi,
        "cost_confidence": cost_result.get("confidence", "Low"),
    }


def get_base_state(db: DBSession, session_id: str) -> dict:
    """
    Build the base_state dict needed by the simulation engine.
    Retrieves stored financial data or recomputes.
    """
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise ValueError(f"Session {session_id} not found")

    projection = db.query(FinancialProjection).filter(
        FinancialProjection.session_id == session_id
    ).first()
    loan = db.query(LoanProduct).filter(
        LoanProduct.session_id == session_id
    ).first()

    if not projection or not loan:
        # Recompute if not yet stored
        result = compute_full_financials(db, session_id)
        return {
            "principal": result["loan_amount"],
            "rate": result["rate"],
            "tenure_months": result["tenure_months"],
            "moratorium_months": result["moratorium_months"],
            "monthly_revenue": result["monthly_revenue"],
            "monthly_opex": result["monthly_opex"],
            "break_even_units": result["break_even_units"],
            "dimension_scores": _default_dimension_scores(result["dscr"], result["roi"], result["break_even_units"], result["monthly_revenue"], session.location_id, session.category_id, session.category_id),
            "confidence_multiplier": 0.85,
        }

    # Reconstruct from stored data
    scheme = match_scheme(loan.project_cost)
    rate = scheme.rate if scheme.matched else 10.0
    tenure_months = (scheme.tenure_years * 12) if scheme.matched else 60
    moratorium_months = scheme.moratorium_months if scheme.matched else 0

    return {
        "principal": loan.loan_amount,
        "rate": rate,
        "tenure_months": tenure_months,
        "moratorium_months": moratorium_months,
        "monthly_revenue": projection.monthly_revenue,
        "monthly_opex": projection.monthly_opex,
        "break_even_units": projection.break_even_units,
        "dimension_scores": _default_dimension_scores(projection.dscr, projection.roi, projection.break_even_units, projection.monthly_revenue, session.location_id, session.category_id, session.category_id),
        "confidence_multiplier": 0.85,
    }



def _default_dimension_scores(dscr: float, roi: float, break_even: float, monthly_revenue: float, location_id: str, category_id: str, category_name: str) -> dict:
    try:
        market_data = run_full_market_analysis(location_id, category_id, category_name)
        comp_count = market_data["competitors"]["value"].get("count", 0)
        pop = market_data["market_reach"]["value"].get("consumer_base", 1000) if market_data["market_reach"]["value"] else 1000
        threats_count = len(market_data["threats"]["value"].get("risk_factors", []))
        overall_confidence = market_data["overall_confidence"]
    except Exception:
        comp_count = 2
        pop = 5000
        threats_count = 1
        overall_confidence = "low"

    net_margin = (roi / 12) if roi > 0 else 0
    monthly_units = monthly_revenue / 100 # Approx

    return compute_all_dimensions(
        roi=roi,
        dscr=dscr,
        net_margin=net_margin,
        break_even_units=break_even,
        monthly_units=monthly_units,
        competitor_count=comp_count,
        population=pop,
        overall_confidence=overall_confidence,
        threats_count=threats_count
    )

