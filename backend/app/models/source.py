from sqlalchemy import Column, String, DateTime
from app.core.db import Base
from app.models.core import uid


class Source(Base):
    __tablename__ = "sources"
    id = Column(String, primary_key=True, default=uid)
    name = Column(String)
    url = Column(String)
    type = Column(String)          # "government", "census", "osm", "prototype_curated"
    retrieved_at = Column(DateTime, nullable=True)
