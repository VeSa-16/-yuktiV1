from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.scheme_tracker import get_tracked_schemes

router = APIRouter()

class TrackerRequest(BaseModel):
    applied_scheme_ids: list[str]

@router.post("/api/tracker")
def post_tracker(req: TrackerRequest):
    try:
        return get_tracked_schemes(req.applied_scheme_ids)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
