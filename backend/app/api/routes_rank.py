"""POST /rank-opportunities — evaluate and rank all business categories."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from app.schemas.ranking import RankRequest, RankResponse, RankedCategory
from app.core.db import get_db
from app.services.ranking_service import rank_opportunities
from app.services.session_service import create_session
from app.engines.scheme_engine import match_scheme
from app.engines.financial_engine import compute_project_cost
from app.models.core import uid

router = APIRouter()


@router.post("/rank-opportunities", response_model=RankResponse)
def rank(req: RankRequest, db: DBSession = Depends(get_db)):
    if req.margin_capital <= 0:
        raise HTTPException(status_code=400, detail="Margin capital must be greater than 0.")
    rankings = rank_opportunities(req.location_id, req.margin_capital)

    # Ensure a session exists in DB for this flow
    from app.models import Session
    session = db.query(Session).filter(Session.id == req.session_id).first()
    if not session:
        session = Session(
            id=req.session_id,
            user_id=req.session_id,
            location_id=req.location_id,
            margin_capital=req.margin_capital,
        )
        db.add(session)
    else:
        session.margin_capital = req.margin_capital
        session.location_id = req.location_id
    db.commit()

    # Check scheme match
    pc = compute_project_cost(req.margin_capital)
    scheme = match_scheme(pc)

    return RankResponse(
        session_id=req.session_id,
        rankings=[RankedCategory(**r) for r in rankings],
        scheme_matched=scheme.matched,
        scheme_name=scheme.scheme_name,
    )
