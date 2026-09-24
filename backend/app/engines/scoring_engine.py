"""
================================================================================
YUKTI DETERMINISTIC SCORING ENGINE
================================================================================

[ARCHITECTURE BOUNDARY: STRICT DETERMINISTIC]
This module contains 100% deterministic scoring logic for risk and viability.
NO LLM OR GENERATIVE AI CALLS ARE PERMITTED IN THIS MODULE.
Scores are calculated via static mathematical formulas acting on proven 
dataset values and the outputs of the deterministic financial engine.

================================================================================
"""
from app.engines.i18n_strings import I18N_DICT

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

def calculate_risk_exposure(overall_confidence: str, threats_count: int, experience: str = "None") -> int:
    # High confidence + low threats = 90
    base = 80 if overall_confidence.lower() == "high" else 50
    
    # Weight experience to reduce risk
    exp_lower = experience.lower()
    if "5+" in exp_lower:
        base += 15
    elif "3-5" in exp_lower:
        base += 10
    elif "1-3" in exp_lower:
        base += 5
    else:
        base -= 5
        
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
    threats_count: int,
    experience: str = "None"
) -> dict:
    return {
        "financial_viability": calculate_financial_viability(roi, net_margin),
        "repayment_capacity": calculate_repayment_capacity(dscr),
        "market_opportunity": calculate_market_opportunity("", competitor_count, population),
        "capital_efficiency": calculate_capital_efficiency(break_even_units, monthly_units),
        "risk_exposure": calculate_risk_exposure(overall_confidence, threats_count, experience),
    }

def compute_evidence_coverage(evidence_list: list[dict]) -> dict:
    total = len(evidence_list)
    if total == 0:
        return {"coverage_pct": 0.0, "overall_confidence": "LOW"}
    
    high_count = sum(1 for e in evidence_list if e.get("confidence", "").upper() == "HIGH")
    medium_count = sum(1 for e in evidence_list if e.get("confidence", "").upper() == "MEDIUM")
    
    coverage_pct = ((high_count * 1.0) + (medium_count * 0.5)) / total * 100
    
    if coverage_pct >= 70:
        confidence = "HIGH"
    elif coverage_pct >= 40:
        confidence = "MEDIUM"
    else:
        confidence = "LOW"
        
    return {"coverage_pct": coverage_pct, "overall_confidence": confidence}

def generate_verdict(overall_score: float, coverage_pct: float = 100.0, language: str = "en") -> dict:
    lang_dict = I18N_DICT.get(language, I18N_DICT["en"])["verdicts"]
    if coverage_pct < 40.0:
        return {"text": lang_dict["insufficient"], "color": "slate-500", "is_abstained": True}
        
    if overall_score >= 75:
        return {"text": lang_dict["strong"], "color": "emerald-600"}
    elif overall_score >= 50:
        return {"text": lang_dict["moderate"], "color": "amber-600"}
    else:
        return {"text": lang_dict["high_risk"], "color": "red-600"}

def generate_next_steps(scores: dict, financials: dict, market: dict, language: str = "en") -> list[dict]:
    lang_dict = I18N_DICT.get(language, I18N_DICT["en"])["next_steps"]
    steps = []
    
    # Financial checks
    if scores.get("repayment_capacity", 50) < 50:
        steps.append({
            "priority": 1,
            "action": lang_dict["restructure_loan"]["action"],
            "reason": lang_dict["restructure_loan"]["reason"],
            "module": "financial"
        })
    elif scores.get("financial_viability", 50) < 60:
        steps.append({
            "priority": 2,
            "action": lang_dict["stress_test"]["action"],
            "reason": lang_dict["stress_test"]["reason"],
            "module": "financial"
        })
        
    # Market checks
    if scores.get("market_opportunity", 50) < 50:
        steps.append({
            "priority": 1,
            "action": lang_dict["analyze_competitors"]["action"],
            "reason": lang_dict["analyze_competitors"]["reason"],
            "module": "market"
        })
        
    # Risk checks
    if scores.get("risk_exposure", 50) < 60:
        steps.append({
            "priority": 2,
            "action": lang_dict["review_threats"]["action"],
            "reason": lang_dict["review_threats"]["reason"],
            "module": "risk"
        })
        
    # Default if everything is great
    if not steps:
        steps.append({
            "priority": 3,
            "action": lang_dict["proceed"]["action"],
            "reason": lang_dict["proceed"]["reason"],
            "module": "general"
        })
        
    return steps

