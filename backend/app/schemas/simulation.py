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
    simulated_roi: float          # annualised net_profit / project cost proxy
    survives_stress: bool         # True when dscr >= 1.0 (can service debt)
