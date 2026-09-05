"""POST /recommend — fetch the final recommendation (YUKTI score + verdict)."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from app.schemas.recommendation import RecommendRequest, RecommendResponse, DimensionScores
from app.services.session_service import get_base_state
from app.engines.recommendation_engine import compute_yukti_score
from app.core.db import get_db

router = APIRouter()

@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest, db: DBSession = Depends(get_db)):
    base_state = get_base_state(db, req.session_id)
    dscr = base_state.get("dimension_scores", {}).get("repayment_capacity", 50) / 50.0  # approximate back
    dscr = max(0.5, dscr) # ensure > 0
    
    score_result = compute_yukti_score(
        dimension_scores=base_state["dimension_scores"],
        confidence_multiplier=base_state["confidence_multiplier"],
        dscr=dscr
    )
    
    return RecommendResponse(
        session_id=req.session_id,
        yukti_score=score_result.final_score,
        raw_score=score_result.raw_score,
        confidence_multiplier=base_state["confidence_multiplier"],
        verdict=score_result.verdict,
        dimension_scores=DimensionScores(**base_state["dimension_scores"]),
        dscr=dscr,
        roi=base_state.get("dimension_scores", {}).get("financial_viability", 50) - 30, # approximation
        next_steps=score_result.next_steps,
        confidence="Medium",
    )
