from pydantic import BaseModel
from typing import Optional

class SchemeMatchRequest(BaseModel):
    session_id: str
    project_cost: float

class SchemeMatchResponse(BaseModel):
    matched: bool
    scheme_name: Optional[str] = None
    max_loan: Optional[float] = None
    rate: Optional[float] = None
    tenure_years: Optional[int] = None
    moratorium_months: Optional[int] = None
    rejected_alternative: Optional[str] = None
    explanation: str
    source_url: Optional[str] = None
