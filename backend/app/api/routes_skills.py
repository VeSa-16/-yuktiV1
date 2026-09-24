from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.skill_assessment import assess_skills

router = APIRouter()

class SkillsRequest(BaseModel):
    has_accounts_exp: bool
    uses_smartphone: bool
    has_sales_exp: bool

@router.post("/api/skills")
def post_skill_assessment(req: SkillsRequest):
    try:
        return assess_skills(
            answers={
                "has_accounts_exp": req.has_accounts_exp,
                "uses_smartphone": req.uses_smartphone,
                "has_sales_exp": req.has_sales_exp
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
