from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.exit_advisor import get_exit_advice

router = APIRouter()

class ExitRequest(BaseModel):
    revenue_drop_pct: float
    current_dscr: float
    category: str

@router.post("/api/exit")
def post_exit_advice(req: ExitRequest):
    try:
        return get_exit_advice(req.revenue_drop_pct, req.current_dscr, req.category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
