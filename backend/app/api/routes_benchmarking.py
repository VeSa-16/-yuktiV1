from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.peer_benchmarking import get_peer_benchmarks

router = APIRouter()

class BenchmarkingRequest(BaseModel):
    category_name: str
    district: str
    yukti_score: int

@router.post("/api/benchmarks")
def post_benchmarks(req: BenchmarkingRequest):
    try:
        return get_peer_benchmarks(req.category_name, req.district, req.yukti_score)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
