from pydantic import BaseModel
from typing import Optional

class SimulateRequest(BaseModel):
    session_id: str
    revenue_delta_pct: float = 0.0
    cost_delta_pct: float = 0.0
    tenure_override_years: Optional[int] = None

class SimulateResponse(BaseModel):
    emi: float
    dscr: float
    break_even_units: float
    verdict: str
    net_profit: float
