"""
Pure deterministic financial math. NEVER import an LLM client here.
Every function must be a closed-form calculation traceable to Section 14/17.
"""
from dataclasses import dataclass

CONTRIBUTION_PCT = 0.10          # beneficiary contribution
FINANCING_PCT = 0.90             # scheme financing share


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
