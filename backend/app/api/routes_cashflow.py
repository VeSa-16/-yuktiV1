from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.seasonal_planner import generate_cashflow_forecast

router = APIRouter()

class CashflowRequest(BaseModel):
    peak_seasons: list[str]
    lean_season: str
    average_monthly_revenue: float

@router.post("/api/cashflow")
def get_cashflow_forecast(req: CashflowRequest):
    try:
        return generate_cashflow_forecast(
            peak_seasons=req.peak_seasons,
            lean_season=req.lean_season,
            average_monthly_revenue=req.average_monthly_revenue
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
