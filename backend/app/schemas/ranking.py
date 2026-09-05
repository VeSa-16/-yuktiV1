from pydantic import BaseModel
from typing import Optional


class RankRequest(BaseModel):
    session_id: str
    location_id: str
    margin_capital: float


class RankedCategory(BaseModel):
    category_id: str
    category_name: str
    yukti_score: float
    verdict: str
    confidence: str
    dscr: Optional[float] = None
    roi: Optional[float] = None
    emi: Optional[float] = None
    net_profit: Optional[float] = None
    highlights: list[str] = []
    note: str = ""


class RankResponse(BaseModel):
    session_id: str
    rankings: list[RankedCategory]
    scheme_matched: bool
    scheme_name: Optional[str] = None
