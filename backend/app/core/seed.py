"""
Seed script — populates the database with demo locations, business categories,
and scheme data on first startup. Idempotent (checks before inserting).
"""
from sqlalchemy.orm import Session as DBSession
from app.models import Location, BusinessCategory, GovernmentScheme
from app.models.core import AdminLevel


DEMO_LOCATIONS = [
    {
        "id": "solapur",
        "district": "Solapur",
        "state": "Maharashtra",
        "village": "Barshi",
        "block": "Barshi",
        "lat": 18.2334,
        "lng": 75.6910,
        "admin_level": AdminLevel.district,
        "data_richness": "rich",
    },
    {
        "id": "sparse_location",
        "district": "Remote District",
        "state": "Maharashtra",
        "village": None,
        "block": None,
        "lat": 19.0,
        "lng": 76.0,
        "admin_level": AdminLevel.district,
        "data_richness": "sparse",
    },
]

DEMO_CATEGORIES = [
    {"id": "dairy", "name": "Dairy", "description": "Small-scale dairy farming (5-10 cattle), milk collection & sale."},
    {"id": "retail_kirana", "name": "Retail / Kirana Store", "description": "General provisions and FMCG retail shop."},
    {"id": "tailoring", "name": "Tailoring", "description": "Garment stitching and alteration unit."},
    {"id": "flour_mill", "name": "Flour Mill", "description": "Grain grinding and flour processing unit."},
    {"id": "poultry", "name": "Poultry", "description": "Broiler poultry farming unit (500+ birds per batch)."},
]

DEMO_SCHEMES = [
    {
        "id": "scheme_micro",
        "name": "Micro Credit Finance",
        "min_project_cost": 0,
        "max_project_cost": 140_000,
        "financing_pct": 0.90,
        "max_loan_amount": 125_000,
        "interest_rate": 6.5,
        "tenure_months": 36,
        "moratorium_months": 3,
        "source_url": "https://nsfdc.nic.in",
    },
    {
        "id": "scheme_term",
        "name": "Term Loan",
        "min_project_cost": 140_001,
        "max_project_cost": 5_000_000,
        "financing_pct": 0.90,
        "max_loan_amount": 4_500_000,
        "interest_rate": 8.0,
        "tenure_months": 84,
        "moratorium_months": 6,
        "source_url": "https://nsfdc.nic.in",
    },
]


def seed_database(db: DBSession):
    """Insert demo data if tables are empty. Idempotent."""
    # Locations
    if db.query(Location).count() == 0:
        for loc in DEMO_LOCATIONS:
            db.add(Location(**loc))
        db.commit()

    # Business categories
    if db.query(BusinessCategory).count() == 0:
        for cat in DEMO_CATEGORIES:
            db.add(BusinessCategory(**cat))
        db.commit()

    # Government schemes
    if db.query(GovernmentScheme).count() == 0:
        for sch in DEMO_SCHEMES:
            db.add(GovernmentScheme(**sch))
        db.commit()
