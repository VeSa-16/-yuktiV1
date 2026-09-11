from .event_engine import EventEngine
from typing import Dict, Any

event_engine = EventEngine()

def run_dynamic_simulation(month: int, cash_balance: float, active_events: list[str], decision: str, scenario_parameters: dict) -> Dict[str, Any]:
    # Deterministic baseline (this would normally come from the YUKTI session state)
    revenue = 60000.0
    operating_cost = 42000.0
    
    # Apply deterministic event effects
    for event_id in active_events:
        event = event_engine.get_event(event_id)
        if event:
            if "demand_change" in event.effects:
                revenue *= (1 + event.effects["demand_change"])
            if "price_pressure" in event.effects:
                revenue *= (1 + event.effects["price_pressure"])
                
    # Apply user decision effects
    if decision == "increase_marketing":
        spend = scenario_parameters.get("marketing_spend", 5000)
        operating_cost += spend
        revenue *= 1.07  # Marketing mitigates some demand loss
    elif decision == "reduce_price":
        revenue *= 0.95
    elif decision == "improve_service":
        operating_cost += 2000
        revenue *= 1.02
        
    net_cash_flow = revenue - operating_cost
    roi = (net_cash_flow * 12) / 200000.0 * 100 if net_cash_flow > 0 else 0
    dscr = net_cash_flow / 8000.0 if net_cash_flow > 0 else 0 # Assuming 8k EMI
    
    return {
        "revenue": round(revenue, 2),
        "operating_cost": round(operating_cost, 2),
        "net_cash_flow": round(net_cash_flow, 2),
        "roi": round(roi, 2),
        "dscr": round(dscr, 2)
    }
