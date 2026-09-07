from pydantic import BaseModel
from typing import Optional, Any, List, Dict

class DataProvenance(BaseModel):
    source_type: str
    source_name: str
    source_url: Optional[str] = None
    dataset_name: Optional[str] = None
    last_updated: Optional[str] = None
    confidence: str
    methodology: Optional[str] = None

class MetricWithProvenance(BaseModel):
    value: Any
    provenance: DataProvenance

class MarketRequest(BaseModel):
    session_id: str
    location_id: str
    category_id: str

class MarketResponse(BaseModel):
    location_id: str
    category_id: str
    category_name: str
    market_reach: MetricWithProvenance
    competitors: MetricWithProvenance
    pricing: MetricWithProvenance
    opportunity_gaps: MetricWithProvenance
    swot: MetricWithProvenance
    threats: MetricWithProvenance
    overall_confidence: str
