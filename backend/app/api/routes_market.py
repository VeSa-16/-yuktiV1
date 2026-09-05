"""POST /analyze-market — run full market intelligence for a category."""
from fastapi import APIRouter, HTTPException
from app.schemas.market import MarketRequest, MarketResponse
from app.engines.market_intelligence import run_full_market_analysis

router = APIRouter()

CATEGORY_NAMES = {
    "dairy": "Dairy",
    "retail_kirana": "Retail / Kirana Store",
    "tailoring": "Tailoring",
    "flour_mill": "Flour Mill",
    "poultry": "Poultry",
}


@router.post("/analyze-market", response_model=MarketResponse)
def analyze_market(req: MarketRequest):
    cat_name = CATEGORY_NAMES.get(req.category_id, req.category_id)
    result = run_full_market_analysis(req.location_id, req.category_id, cat_name)
    return MarketResponse(**result)
