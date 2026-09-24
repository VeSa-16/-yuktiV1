from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.compliance_calendar import get_compliance_calendar

router = APIRouter()

class ComplianceRequest(BaseModel):
    monthly_revenue: float
    business_type: str

@router.post("/api/compliance")
def post_compliance(req: ComplianceRequest):
    try:
        return get_compliance_calendar(req.monthly_revenue, req.business_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
