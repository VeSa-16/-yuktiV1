"""POST /report — generate HTML/PDF report."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from datetime import datetime, timezone
from app.schemas.report import ReportRequest, ReportResponse
from app.core.db import get_db

from app.reports.report_builder import generate_html_report

router = APIRouter()

@router.post("/report", response_model=ReportResponse)
def report(req: ReportRequest, db: DBSession = Depends(get_db)):
    html_content = generate_html_report(db, req.session_id)
    return ReportResponse(
        session_id=req.session_id,
        html_content=html_content,
        generated_at=datetime.now(timezone.utc).isoformat()
    )
