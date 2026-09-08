"""
Pure deterministic financial math. NEVER import an LLM client here.
Every function must be a closed-form calculation traceable to Section 14/17.
"""
from dataclasses import dataclass
from typing import Optional

CONTRIBUTION_PCT = 0.10          # beneficiary contribution
FINANCING_PCT = 0.90             # scheme financing share

# Seasonal demand multipliers by industry (index 0 = January, 11 = December)
# Values represent relative demand vs annual average (1.0 = average month)
SEASONAL_INDEX: dict[str, list[float]] = {
    "dairy":        [1.05, 1.00, 0.95, 0.90, 0.85, 0.80, 0.85, 0.90, 0.95, 1.00, 1.10, 1.15],
    "retail_kirana":[1.10, 0.95, 0.90, 0.95, 0.90, 0.85, 0.90, 0.90, 0.95, 1.10, 1.20, 1.30],
    "tailoring":    [1.15, 0.85, 0.90, 1.05, 0.80, 0.85, 0.90, 0.90, 0.95, 1.20, 1.10, 1.35],
    "flour_mill":   [1.00, 1.00, 0.95, 0.95, 1.05, 1.10, 1.10, 1.05, 1.00, 1.00, 0.95, 0.85],
    "poultry":      [1.10, 1.00, 0.90, 0.85, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05, 1.15, 1.25],
}
SEASONAL_DEFAULT = [1.0] * 12

MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]


def compute_project_cost(margin_capital: float) -> float:
    """PC = Margin / 0.10  (Section 17.1)"""
    if margin_capital <= 0:
        raise ValueError("margin_capital must be > 0")
    return margin_capital / CONTRIBUTION_PCT


def compute_loan_amount(project_cost: float, scheme_max_loan: float | None = None) -> float:
    """Loan = PC * 0.90, capped at the matched scheme's ceiling if provided."""
    loan = project_cost * FINANCING_PCT
    if scheme_max_loan is not None:
        loan = min(loan, scheme_max_loan)
    return loan


def compute_emi(principal: float, annual_rate_pct: float, tenure_months: int,
                 moratorium_months: int = 0) -> float:
    """
    Standard reducing-balance EMI, repayment starts after the moratorium.
    Moratorium does not waive interest by default here — flag if your
    scheme's actual moratorium is interest-free vs. interest-accruing.
    """
    r = (annual_rate_pct / 100) / 12
    n = tenure_months - moratorium_months
    if n <= 0:
        raise ValueError("tenure_months must exceed moratorium_months")
    if r == 0:
        return principal / n
    emi = principal * r * (1 + r) ** n / ((1 + r) ** n - 1)
    return round(emi, 2)


def compute_dscr(net_operating_income_monthly: float, emi: float) -> float:
    """Debt Service Coverage Ratio — the repayment-capacity hard gate input."""
    if emi == 0:
        return float("inf")
    return round(net_operating_income_monthly / emi, 2)


def compute_break_even_units(fixed_costs_monthly: float, price_per_unit: float,
                              variable_cost_per_unit: float) -> float:
    contribution = price_per_unit - variable_cost_per_unit
    if contribution <= 0:
        raise ValueError("price must exceed variable cost per unit")
    return round(fixed_costs_monthly / contribution, 1)


def compute_net_profit(monthly_revenue: float, monthly_opex: float) -> float:
    return round(monthly_revenue - monthly_opex, 2)


def compute_roi(net_annual_profit: float, total_investment: float) -> float:
    if total_investment == 0:
        return 0.0
    return round((net_annual_profit / total_investment) * 100, 2)


# ─── NEW EXTENDED FUNCTIONS ──────────────────────────────────────────────────

def compute_cashflow_projection(
    monthly_revenue: float,
    monthly_opex: float,
    emi: float,
    moratorium_months: int = 0,
    category_id: str = "retail_kirana",
    num_months: int = 12,
) -> list[dict]:
    """
    Month-by-month cash flow for `num_months` months.
    Revenue is scaled by seasonal index. EMI only kicks in after moratorium.
    Returns a list of dicts with month, revenue, expenses, emi_payment, net_cash, cumulative.
    """
    seasonals = SEASONAL_INDEX.get(category_id, SEASONAL_DEFAULT)
    cumulative = 0.0
    projection = []
    for i in range(num_months):
        month_idx = i % 12
        rev = round(monthly_revenue * seasonals[month_idx], 2)
        opex = round(monthly_opex * seasonals[month_idx], 2)
        emi_payment = round(emi, 2) if i >= moratorium_months else 0.0
        net = round(rev - opex - emi_payment, 2)
        cumulative = round(cumulative + net, 2)
        projection.append({
            "month": MONTH_NAMES[month_idx],
            "month_num": i + 1,
            "revenue": rev,
            "expenses": opex,
            "emi_payment": emi_payment,
            "net_cash": net,
            "cumulative": cumulative,
        })
    return projection


def compute_pnl_statement(
    monthly_revenue: float,
    monthly_opex: float,
    cogs_pct: float = 0.45,
) -> dict:
    """
    Monthly Profit & Loss statement.
    cogs_pct: COGS as a fraction of revenue (default 45% — common for retail/micro-enterprise).
    """
    cogs = round(monthly_revenue * cogs_pct, 2)
    gross_profit = round(monthly_revenue - cogs, 2)
    gross_margin_pct = round((gross_profit / monthly_revenue) * 100, 1) if monthly_revenue else 0
    ebit = round(gross_profit - monthly_opex, 2)
    # Simplified tax: 0 for micro-enterprise below ₹5L annual profit threshold
    tax = round(max(0, ebit * 0.05), 2)
    net_profit = round(ebit - tax, 2)
    net_margin_pct = round((net_profit / monthly_revenue) * 100, 1) if monthly_revenue else 0

    return {
        "revenue": round(monthly_revenue, 2),
        "cogs": cogs,
        "gross_profit": gross_profit,
        "gross_margin_pct": gross_margin_pct,
        "operating_expenses": round(monthly_opex, 2),
        "ebit": ebit,
        "tax": tax,
        "net_profit": net_profit,
        "net_margin_pct": net_margin_pct,
    }


def compute_working_capital(
    monthly_revenue: float,
    monthly_opex: float,
    selling_price_per_unit: float = 100.0,
    variable_cost_per_unit: float = 60.0,
    receivable_days: int = 7,
    payable_days: int = 14,
    inventory_days: int = 10,
) -> dict:
    """
    Working capital requirement.
    WC = (Inventory + Receivables - Payables) expressed in ₹/day terms.
    """
    daily_revenue = round(monthly_revenue / 30, 2)
    daily_opex = round(monthly_opex / 30, 2)
    daily_cogs = round(daily_revenue * 0.45, 2)

    inventory_req = round(daily_cogs * inventory_days, 2)
    receivables = round(daily_revenue * receivable_days, 2)
    payables = round(daily_cogs * payable_days, 2)

    net_wc = round(inventory_req + receivables - payables, 2)
    daily_wc = round(daily_opex + daily_revenue * 0.1, 2)   # daily float needed
    weekly_wc = round(daily_wc * 7, 2)
    recommended_buffer = round(net_wc * 0.20, 2)

    return {
        "daily_cash_needed": daily_wc,
        "weekly_cash_needed": weekly_wc,
        "monthly_working_capital": net_wc,
        "inventory_requirement": inventory_req,
        "receivables": receivables,
        "payables": payables,
        "recommended_buffer": recommended_buffer,
        "receivable_days": receivable_days,
        "payable_days": payable_days,
        "inventory_days": inventory_days,
    }


def compute_revenue_scenarios(
    monthly_revenue: float,
    monthly_opex: float,
    emi: float,
    total_investment: float,
) -> dict:
    """
    Three revenue scenarios — pessimistic (60%), realistic (100%), optimistic (130%).
    For each: monthly revenue, monthly net profit, annual profit, ROI, payback months.
    """
    scenarios = {}
    for label, factor in [("pessimistic", 0.60), ("realistic", 1.00), ("optimistic", 1.30)]:
        rev = round(monthly_revenue * factor, 2)
        opex = round(monthly_opex * factor * 0.85, 2)  # opex scales at 85% of revenue change
        net = round(rev - opex - emi, 2)
        annual_net = round(net * 12, 2)
        roi = round((annual_net / total_investment) * 100, 1) if total_investment else 0
        payback = round(total_investment / net, 1) if net > 0 else None
        scenarios[label] = {
            "monthly_revenue": rev,
            "monthly_opex": opex,
            "monthly_net_profit": net,
            "annual_net_profit": annual_net,
            "roi_pct": roi,
            "payback_months": payback,
        }
    return scenarios


def compute_payback_period(
    monthly_revenue: float,
    monthly_opex: float,
    emi: float,
    total_investment: float,
    moratorium_months: int = 0,
    category_id: str = "retail_kirana",
    max_months: int = 60,
) -> dict:
    """
    Compute the month in which cumulative net cash flow turns positive (= payback achieved).
    Uses seasonal index for accuracy.
    """
    seasonals = SEASONAL_INDEX.get(category_id, SEASONAL_DEFAULT)
    cumulative = 0.0
    payback_month = None
    for i in range(max_months):
        idx = i % 12
        rev = monthly_revenue * seasonals[idx]
        opex = monthly_opex * seasonals[idx]
        emi_payment = emi if i >= moratorium_months else 0
        net = rev - opex - emi_payment
        cumulative += net
        if cumulative >= 0 and payback_month is None:
            payback_month = i + 1
            break

    return {
        "payback_months": payback_month,
        "payback_achieved": payback_month is not None,
        "total_investment": round(total_investment, 2),
        "note": f"Business recovers full investment in ~{payback_month} months" if payback_month else "Investment not recovered within 5 years at current rate",
    }


def compute_seasonal_revenue(
    monthly_revenue: float,
    category_id: str = "retail_kirana",
) -> list[dict]:
    """
    12-month seasonal revenue forecast based on industry-specific multipliers.
    """
    seasonals = SEASONAL_INDEX.get(category_id, SEASONAL_DEFAULT)
    return [
        {
            "month": MONTH_NAMES[i],
            "revenue": round(monthly_revenue * seasonals[i], 2),
            "index": seasonals[i],
        }
        for i in range(12)
    ]


@dataclass
class FinancialSnapshot:
    project_cost: float
    loan_amount: float
    contribution: float
    emi: float
    dscr: float
    break_even_units: float
    net_profit: float
    roi: float
