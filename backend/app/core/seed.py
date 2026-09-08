"""
Seed script — populates the database with demo locations, business categories,
and scheme data from JSON files on first startup. Idempotent (checks before inserting).
"""
import json
import os
from datetime import datetime
from sqlalchemy.orm import Session as DBSession
from app.models import (
    Location, BusinessCategory, GovernmentScheme, Source,
    Competitor, MarketMetric, Price, CostModel
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_json(filename: str):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def parse_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str)
    except ValueError:
        return None

def seed_database(db: DBSession):
    """Insert demo data if tables are empty. Idempotent.
    Uses a fast single-table check as an early-exit guard to avoid
    running 8 count queries on every uvicorn --reload in development.
    """
    # Fast early-exit: if categories are already seeded, nothing to do
    if db.query(BusinessCategory).count() > 0:
        return
    
    # 1. Data Sources
    if db.query(Source).count() == 0:
        sources = load_json("data_sources.json")
        for s in sources:
            db.add(Source(**s))
        db.commit()

    # 2. Locations
    if db.query(Location).count() == 0:
        locations = load_json("locations.json")
        for loc in locations:
            db.add(Location(**loc))
        db.commit()

    # 3. Business Categories
    if db.query(BusinessCategory).count() == 0:
        categories = load_json("categories.json")
        for cat in categories:
            db.add(BusinessCategory(**cat))
        db.commit()

    # 4. Competitors
    if db.query(Competitor).count() == 0:
        competitors = load_json("competitors.json")
        for comp in competitors:
            comp["last_verified"] = parse_date(comp.get("last_verified"))
            db.add(Competitor(**comp))
        db.commit()

    # 5. Market Metrics
    if db.query(MarketMetric).count() == 0:
        metrics = load_json("market_metrics.json")
        for metric in metrics:
            metric["effective_date"] = parse_date(metric.get("effective_date"))
            db.add(MarketMetric(**metric))
        db.commit()

    # 6. Prices
    if db.query(Price).count() == 0:
        prices = load_json("prices.json")
        for p in prices:
            db.add(Price(**p))
        db.commit()

    # 7. Cost Models
    if db.query(CostModel).count() == 0:
        cost_models = load_json("cost_models.json")
        for cm in cost_models:
            db.add(CostModel(**cm))
        db.commit()

    # 8. Government Schemes
    if db.query(GovernmentScheme).count() == 0:
        schemes = load_json("schemes.json")
        for sch in schemes:
            sch["effective_from"] = parse_date(sch.get("effective_from"))
            db.add(GovernmentScheme(**sch))
        db.commit()

    # Note: risks.json is not currently mapped to a SQLAlchemy model in this pass,
    # but the JSON exists for future usage or for the engine.
