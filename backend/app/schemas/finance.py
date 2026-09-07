from pydantic import BaseModel
from typing import Optional

class FinanceRequest(BaseModel):
    session_id: str

class FinanceResponse(BaseModel):
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
