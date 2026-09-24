from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum

class ConfidenceLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class EvidenceRecord(BaseModel):
    metric: str
    value: str | float
    source: str
    source_url: Optional[str] = None
    geography: str
    observed_at: Optional[date] = None
    retrieved_at: datetime = Field(default_factory=datetime.utcnow)
    resolution: str
    method: str
    confidence: ConfidenceLevelEnum
    coverage_pct: float = Field(ge=0, le=100)
    limitation: Optional[str] = None
    data_source: str = "static_dataset"
