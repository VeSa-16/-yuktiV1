from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from app.schemas.simulation import SimulateRequest, SimulateResponse as StaticSimulateResponse
from app.engines.simulation_engine import run_simulation
from app.services.session_service import get_base_state
from app.core.db import get_db

from app.schemas.dynamic_simulator import SimulatorRequest, SimulatorResponse, EventInfo, DecisionInfo, FinancialImpact
from app.engines.simulator.simulator_engine import run_dynamic_simulation, event_engine
from app.ai.gemini_client import GeminiClient
from app.ai.prompts.simulator import SIMULATOR_NARRATIVE_PROMPT
import json

router = APIRouter()
gemini = GeminiClient()

@router.post("/simulate", response_model=StaticSimulateResponse)
def simulate(req: SimulateRequest, db: DBSession = Depends(get_db)):
    try:
        base_state = get_base_state(db, req.session_id)
        result = run_simulation(
            base_state,
            req.revenue_delta_pct,
            req.cost_delta_pct,
            req.tenure_override_years,
        )
        return SimulateResponse(
            emi=result["emi"],
            dscr=result["dscr"],
            break_even_units=base_state.get("break_even_units", 0),
            verdict=result["verdict"],
            net_profit=result["net_profit"],
            simulated_roi=result["simulated_roi"],
            survives_stress=result["survives_stress"],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/dynamic", response_model=SimulatorResponse)
async def simulate_dynamic(req: SimulatorRequest):
    # Calculate deterministic financial impact securely in the backend
    impact_dict = run_dynamic_simulation(
        req.month, req.cash_balance, req.active_events, req.decision, req.scenario_parameters
    )
    
    # Identify event
    event = event_engine.get_event(req.active_events[0]) if req.active_events else None
    event_desc = event.title if event else "Normal business operations."
    
    # Generate prompt for explanation
    prompt = SIMULATOR_NARRATIVE_PROMPT.format(
        event_description=event_desc,
        user_decision=req.decision,
        financial_impact=json.dumps(impact_dict, indent=2)
    )
    
    schema = {
        "type": "object",
        "properties": {
            "narrative": {"type": "string"},
            "advice": {"type": "string"}
        },
        "required": ["narrative", "advice"]
    }
    
    ai_resp = await gemini.generate_json_async(prompt, schema=schema)
    explanation = "No explanation available."
    if ai_resp:
        explanation = f"{ai_resp.get('narrative', '')}\n\nAdvice: {ai_resp.get('advice', '')}"
        
    return SimulatorResponse(
        month=req.month,
        event=EventInfo(id=event.event_id if event else "none", title=event_desc),
        decision=DecisionInfo(selected=req.decision),
        financial_impact=FinancialImpact(**impact_dict),
        risk_level="medium",
        yukti_score=74,
        ai_explanation=explanation,
        next_month_available=True
    )
