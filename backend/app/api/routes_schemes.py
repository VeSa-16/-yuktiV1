from fastapi import APIRouter
from app.schemas.scheme import SchemeMatchRequest, SchemeMatchResponse
from app.engines.scheme_engine import match_scheme, SCHEMES

router = APIRouter()

@router.get("/schemes")
def list_schemes():
    return SCHEMES

@router.post("/match-scheme", response_model=SchemeMatchResponse)
def match(req: SchemeMatchRequest):
    result = match_scheme(req.project_cost)
    return SchemeMatchResponse(**result.__dict__)
