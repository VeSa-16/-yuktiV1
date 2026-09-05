from sqlalchemy import Column, String, Float, ForeignKey
from app.core.db import Base
from app.models.core import uid


class Competitor(Base):
    __tablename__ = "competitors"
    id = Column(String, primary_key=True, default=uid)
    location_id = Column(String, ForeignKey("locations.id"))
    category_id = Column(String, ForeignKey("business_categories.id"))
    name = Column(String)
    distance_km = Column(Float, nullable=True)
    data_origin = Column(String, default="prototype_curated")  # public_source | prototype_curated
    source = Column(String, nullable=True)
