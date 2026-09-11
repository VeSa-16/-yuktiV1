import contextlib
import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import init_db, SessionLocal
from app.core.config import settings
from app.core.seed import seed_database
from app.api import (
    routes_profile, routes_rank, routes_market, routes_recommend,
    routes_explain, routes_report, routes_finance, routes_schemes, routes_simulate,
    routes_copilot, routes_business_plan, routes_marketing, routes_competitor,
    routes_analysis, routes_locations
)

logger = logging.getLogger("yukti")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    logger.info("YuktiFi backend started successfully.")
    yield


app = FastAPI(title="YuktiFi API", lifespan=lifespan)

# Parse comma-separated CORS origins safely
_cors_raw = settings.cors_origins
if _cors_raw == "*":
    _cors_origins: list[str] = ["*"]
else:
    _cors_origins = [o.strip() for o in _cors_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000)
    logger.info(
        "%s %s → %d (%dms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


app.include_router(routes_profile.router)
app.include_router(routes_rank.router)
app.include_router(routes_market.router)
app.include_router(routes_recommend.router)
app.include_router(routes_explain.router)
app.include_router(routes_report.router)
app.include_router(routes_finance.router)
app.include_router(routes_schemes.router)
app.include_router(routes_simulate.router)
app.include_router(routes_copilot.router, prefix="/api/copilot", tags=["copilot"])
app.include_router(routes_business_plan.router, prefix="/api/business-plan", tags=["business-plan"])
app.include_router(routes_marketing.router, prefix="/api/marketing", tags=["marketing"])
app.include_router(routes_competitor.router, prefix="/api/competitor", tags=["competitor"])
app.include_router(routes_analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(routes_locations.router, prefix="/api/locations", tags=["locations"])


@app.get("/health")
def health_check():
    """Lightweight health probe — verifies DB is reachable."""
    try:
        db = SessionLocal()
        db.execute(__import__("sqlalchemy").text("SELECT 1"))
        db.close()
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {e}"
    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "version": "2.0.0",
        "database": db_status,
    }
