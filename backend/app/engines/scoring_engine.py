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
    # Deterministic based on competitor density and gap string (or we can use density)
    if competitor_count == 0 and population > 1000:
        return 90
    if competitor_count > 5:
        return 40
    return 65 # Default moderate

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

