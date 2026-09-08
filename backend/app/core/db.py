from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

connect_args = {}
is_sqlite = settings.database_url.startswith("sqlite")
if is_sqlite:
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,  # Detect stale connections before using them
)

# Enable WAL mode and performance PRAGMAs for SQLite
if is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")   # Allow concurrent reads + writes
        cursor.execute("PRAGMA synchronous=NORMAL")  # Faster writes, still safe
        cursor.execute("PRAGMA cache_size=-32000")   # 32MB page cache
        cursor.execute("PRAGMA temp_store=MEMORY")   # Temp tables in RAM
        cursor.close()

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
