from sqlalchemy import Column, String, Float, ForeignKey
from app.core.db import Base
from app.models.core import uid


class CostModel(Base):
    """Cost profile for a business category — fixed + variable costs."""
    __tablename__ = "cost_models"
    id = Column(String, primary_key=True, default=uid)
    category_id = Column(String, ForeignKey("business_categories.id"))
    fixed_cost_monthly = Column(Float)        # rent, salary, insurance
    variable_cost_per_unit = Column(Float)
    selling_price_per_unit = Column(Float)
    estimated_monthly_revenue = Column(Float)
    estimated_monthly_units = Column(Float, nullable=True)
    data_origin = Column(String, default="prototype_curated")
    note = Column(String, nullable=True)
