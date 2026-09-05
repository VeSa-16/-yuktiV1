from sqlalchemy import Column, String, Float, ForeignKey
from app.core.db import Base
from app.models.core import uid


class MarketMetric(Base):
    """Stores computed market metrics for a location+category pair."""
    __tablename__ = "market_metrics"
    id = Column(String, primary_key=True, default=uid)
    location_id = Column(String, ForeignKey("locations.id"))
    category_id = Column(String, ForeignKey("business_categories.id"))
    metric_name = Column(String)   # e.g. "consumer_base", "demand_index", "competition_score"
    value = Column(Float, nullable=True)
    confidence = Column(String, default="Low")
    data_origin = Column(String, default="prototype_curated")
    note = Column(String, nullable=True)
