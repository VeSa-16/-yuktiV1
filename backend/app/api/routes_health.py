from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.health_tracker import calculate_health_status

router = APIRouter()

class HealthRequest(BaseModel):
    monthly_revenue: float
    monthly_expenses: float
    emi: float

@router.post("/api/health")
def get_health_status(req: HealthRequest):
    try:
        return calculate_health_status(
            monthly_revenue=req.monthly_revenue,
            monthly_expenses=req.monthly_expenses,
            emi=req.emi
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
