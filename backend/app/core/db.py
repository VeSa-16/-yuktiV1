from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Call on startup."""
    from app.models import (  # noqa: F401 — force all models to register
        User, Location, BusinessCategory, Session, Competitor,
        MarketMetric, CostModel, GovernmentScheme, SchemeRule,
        LoanProduct, FinancialProjection, Scenario, Recommendation,
        ConfidenceTag, Source,
    )
    Base.metadata.create_all(bind=engine)
