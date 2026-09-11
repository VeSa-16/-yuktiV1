def calculate_financial_viability(roi: float, net_margin: float) -> int:
    # ROI target > 30%, Margin target > 20%
    score = (min(roi, 50.0) / 50.0) * 50 + (min(net_margin, 30.0) / 30.0) * 50
    return int(max(0, min(100, score)))

def calculate_repayment_capacity(dscr: float) -> int:
    # DSCR > 2.0 is perfect, 1.0 is borderline 40
    if dscr < 1.0: return 20
    score = (dscr / 2.5) * 100
    return int(max(0, min(100, score)))

def calculate_market_opportunity(gap_assessment: str, competitor_count: int, population: int) -> int:
    if population <= 0:
        return 50  # Unknown baseline
    
    # customers per competitor
    effective_competitors = max(1, competitor_count)
    density = population / effective_competitors
    
    # E.g., 2000 customers per competitor = 100 score
    score = (density / 2000) * 100
    return int(max(0, min(100, score)))

def calculate_capital_efficiency(break_even_units: float, monthly_units: float) -> int:
    if monthly_units == 0: return 0
    ratio = break_even_units / monthly_units
    # If break-even is 50% of monthly sales, that's good. If it's 100%, that's bad.
    score = 100 - (ratio * 100)
    return int(max(0, min(100, score)))

def calculate_risk_exposure(overall_confidence: str, threats_count: int) -> int:
    # High confidence + low threats = 90
    base = 80 if overall_confidence.lower() == "high" else 50
    score = base - (threats_count * 10)
    return int(max(0, min(100, score)))

def compute_all_dimensions(
    roi: float, 
    dscr: float, 
    net_margin: float,
    break_even_units: float,
    monthly_units: float,
    competitor_count: int,
    population: int,
    overall_confidence: str,
    threats_count: int
) -> dict:
    return {
        "financial_viability": calculate_financial_viability(roi, net_margin),
        "repayment_capacity": calculate_repayment_capacity(dscr),
        "market_opportunity": calculate_market_opportunity("", competitor_count, population),
        "capital_efficiency": calculate_capital_efficiency(break_even_units, monthly_units),
        "risk_exposure": calculate_risk_exposure(overall_confidence, threats_count),
    }

def generate_verdict(overall_score: float) -> dict:
    if overall_score >= 75:
        return {"text": "Strong Opportunity", "color": "emerald-600"}
    elif overall_score >= 50:
        return {"text": "Moderate Potential", "color": "amber-600"}
    else:
        return {"text": "High Risk", "color": "red-600"}

def generate_next_steps(scores: dict, financials: dict, market: dict) -> list[dict]:
    steps = []
    
    # Financial checks
    if scores.get("repayment_capacity", 50) < 50:
        steps.append({
            "priority": 1,
            "action": "Restructure loan amount",
            "reason": "Debt service coverage ratio (DSCR) is too low to comfortably service the EMI.",
            "module": "financial"
        })
    elif scores.get("financial_viability", 50) < 60:
        steps.append({
            "priority": 2,
            "action": "Stress-test margins",
            "reason": "Expected net margins are below the safe threshold for this sector.",
            "module": "financial"
        })
        
    # Market checks
    if scores.get("market_opportunity", 50) < 50:
        steps.append({
            "priority": 1,
            "action": "Analyze local competitors",
            "reason": "Competitor density is high relative to the target population.",
            "module": "market"
        })
        
    # Risk checks
    if scores.get("risk_exposure", 50) < 60:
        steps.append({
            "priority": 2,
            "action": "Review identified threats",
            "reason": "Several structural risks were identified in the market data.",
            "module": "risk"
        })
        
    # Default if everything is great
    if not steps:
        steps.append({
            "priority": 3,
            "action": "Proceed to Business Plan",
            "reason": "All core metrics look healthy. Begin formalizing the launch strategy.",
            "module": "general"
        })
        
    return steps

