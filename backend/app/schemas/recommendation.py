from pydantic import BaseModel
from typing import Optional


class RecommendRequest(BaseModel):
    session_id: str


class DimensionScores(BaseModel):
    financial_viability: float
    repayment_capacity: float
    market_opportunity: float
    capital_efficiency: float
    risk_exposure: float


class RecommendResponse(BaseModel):
    session_id: str
    yukti_score: float
    raw_score: float
    confidence_multiplier: float
    verdict: str
    dimension_scores: DimensionScores
    dscr: float
    roi: float
    next_steps: list[str]
    confidence: str
