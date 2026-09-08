from pydantic import BaseModel
from typing import Optional, List


class FinanceRequest(BaseModel):
    session_id: str


class PnlStatement(BaseModel):
    revenue: float
    cogs: float
    gross_profit: float
    gross_margin_pct: float
    operating_expenses: float
    ebit: float
    tax: float
    net_profit: float
    net_margin_pct: float


class WorkingCapital(BaseModel):
    daily_cash_needed: float
    weekly_cash_needed: float
    monthly_working_capital: float
    inventory_requirement: float
    receivables: float
    payables: float
    recommended_buffer: float
    receivable_days: int
    payable_days: int
    inventory_days: int


class PaybackPeriod(BaseModel):
    payback_months: Optional[int]
    payback_achieved: bool
    total_investment: float
    note: str


class FinanceResponse(BaseModel):
    # Core
    project_cost: float
    loan_amount: float
    beneficiary_contribution: float
    scheme: dict
    emi: float
    rate: float
    tenure_months: int
    moratorium_months: int
    monthly_revenue: float
    monthly_opex: float
    net_profit: float
    dscr: float
    break_even_units: float
    roi: float
    cost_confidence: str

    # Extended
    cashflow_projection: List[dict] = []
    pnl_statement: Optional[PnlStatement] = None
    working_capital: Optional[WorkingCapital] = None
    revenue_scenarios: dict = {}
    seasonal_revenue: List[dict] = []
    payback_period: Optional[PaybackPeriod] = None
