from pydantic import BaseModel
from typing import List, Dict, Any

class SimulatorRequest(BaseModel):
    business_id: str
    month: int
    cash_balance: float
    active_events: List[str]
    decision: str
    scenario_parameters: Dict[str, Any]

class EventInfo(BaseModel):
    id: str
    title: str

class DecisionInfo(BaseModel):
    selected: str

class FinancialImpact(BaseModel):
    revenue: float
    operating_cost: float
    net_cash_flow: float
    roi: float
    dscr: float

class SimulatorResponse(BaseModel):
    month: int
    event: EventInfo
    decision: DecisionInfo
    financial_impact: FinancialImpact
    risk_level: str
    yukti_score: int
    ai_explanation: str
    next_month_available: bool
