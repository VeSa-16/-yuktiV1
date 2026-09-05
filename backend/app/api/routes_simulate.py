"""POST /simulate — run what-if scenarios on the financial model."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session as DBSession
from app.schemas.simulation import SimulateRequest, SimulateResponse
from app.engines.simulation_engine import run_simulation
from app.services.session_service import get_base_state
from app.core.db import get_db

router = APIRouter()

@router.post("/simulate", response_model=SimulateResponse)
def simulate(req: SimulateRequest, db: DBSession = Depends(get_db)):
    base_state = get_base_state(db, req.session_id)
    result = run_simulation(base_state, req.revenue_delta_pct, req.cost_delta_pct, req.tenure_override_years)
    return SimulateResponse(
        emi=result["emi"], dscr=result["dscr"],
        break_even_units=base_state.get("break_even_units", 0),
        verdict=result["verdict"], net_profit=result["net_profit"],
    )
