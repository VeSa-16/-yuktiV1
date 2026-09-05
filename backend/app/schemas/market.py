from pydantic import BaseModel
from typing import Optional, Any


class MarketRequest(BaseModel):
    session_id: str
    location_id: str
    category_id: str


class MarketResponse(BaseModel):
    location_id: str
    category_id: str
    category_name: str
    market_reach: dict
    competitors: dict
    pricing: dict
    opportunity_gaps: dict
    swot: dict
    threats: dict
    overall_confidence: str
