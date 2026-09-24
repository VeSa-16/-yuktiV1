from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.insurance_advisor import get_insurance_recommendations

router = APIRouter()

class InsuranceRequest(BaseModel):
    category_name: str

@router.post("/api/insurance")
def post_insurance(req: InsuranceRequest):
    try:
        return get_insurance_recommendations(req.category_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
