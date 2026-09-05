"""
Report Generation Layer.
Builds the HTML report summarizing the user's session and chosen business plan.
"""
import os
from jinja2 import Environment, FileSystemLoader
from sqlalchemy.orm import Session as DBSession
from app.models import Session, Location, BusinessCategory, LoanProduct, FinancialProjection

# Set up Jinja2 environment
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def generate_html_report(db: DBSession, session_id: str) -> str:
    """Generate a comprehensive HTML report from session data."""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        return "<p>Session not found.</p>"

    location = db.query(Location).filter(Location.id == session.location_id).first()
    category = db.query(BusinessCategory).filter(BusinessCategory.id == session.category_id).first()
    loan = db.query(LoanProduct).filter(LoanProduct.session_id == session_id).first()
    projection = db.query(FinancialProjection).filter(FinancialProjection.session_id == session_id).first()

    context = {
        "session": session,
        "location": location,
        "category": category,
        "loan": loan,
        "projection": projection,
    }

    template = env.get_template("report.html.jinja")
    return template.render(**context)
