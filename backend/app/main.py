import contextlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import init_db, SessionLocal
from app.core.config import settings
from app.core.seed import seed_database
from app.api import (
    routes_profile, routes_rank, routes_market, routes_recommend,
    routes_explain, routes_report, routes_finance, routes_schemes, routes_simulate
)

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    yield

app = FastAPI(title="YUKTI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_profile.router)
app.include_router(routes_rank.router)
app.include_router(routes_market.router)
app.include_router(routes_recommend.router)
app.include_router(routes_explain.router)
app.include_router(routes_report.router)
app.include_router(routes_finance.router)
app.include_router(routes_schemes.router)
app.include_router(routes_simulate.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}
