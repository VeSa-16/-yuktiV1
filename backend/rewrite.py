content = '''\"\"\"POST /recommend - fetch the final recommendation (YUKTI score + verdict).\"\"\"
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
    
    from app.models import FinancialProjection
    projection = db.query(FinancialProjection).filter(FinancialProjection.session_id == req.session_id).first()
    
    if projection:
        dscr = max(0.5, projection.dscr)
        roi = projection.roi
    else:
        dscr = 1.0
        roi = 15.0

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
        roi=roi,
        next_steps=getattr(score_result, 'next_steps', ["Verify assumptions with local experts.", "Apply for eligible scheme matching your margin capital."]),
        confidence="Medium",
    )
'''

with open('d:/yukti/backend/app/api/routes_recommend.py', 'w', encoding='utf-8') as f:
    f.write(content)
print("File rewritten.")
