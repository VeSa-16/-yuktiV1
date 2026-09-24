import pytest
from app.engines.scoring_engine import (
    calculate_financial_viability,
    calculate_repayment_capacity,
    calculate_market_opportunity,
    calculate_capital_efficiency,
    calculate_risk_exposure,
    compute_all_dimensions,
    compute_evidence_coverage,
    generate_verdict
)

def test_calculate_financial_viability():
    # ROI target > 30%, Margin target > 20%
    # Perfect score: roi >= 50, margin >= 30 -> 1.0*50 + 1.0*50 = 100
    assert calculate_financial_viability(60.0, 40.0) == 100
    # Zero score
    assert calculate_financial_viability(0.0, 0.0) == 0
    # Half score
    assert calculate_financial_viability(25.0, 15.0) == 50

def test_calculate_repayment_capacity():
    # DSCR > 2.5 is 100
    assert calculate_repayment_capacity(3.0) == 100
    assert calculate_repayment_capacity(2.5) == 100
    # DSCR < 1.0 is 20
    assert calculate_repayment_capacity(0.5) == 20
    # DSCR = 1.25 -> 50
    assert calculate_repayment_capacity(1.25) == 50

def test_calculate_market_opportunity():
    # population = 20000, competitors = 10 -> density 2000 -> 100
    assert calculate_market_opportunity("", 10, 20000) == 100
    # zero population
    assert calculate_market_opportunity("", 10, 0) == 50
    # high competition -> 20000 / 40 -> 500 -> 25 score
    assert calculate_market_opportunity("", 40, 20000) == 25

def test_calculate_capital_efficiency():
    # break_even 50, monthly 100 -> ratio 0.5 -> 100 - 50 = 50
    assert calculate_capital_efficiency(50, 100) == 50
    # boundary: zero monthly units
    assert calculate_capital_efficiency(50, 0) == 0
    # boundary: break even > monthly -> ratio > 1 -> score 0
    assert calculate_capital_efficiency(150, 100) == 0
    # boundary: break even 0 -> 100
    assert calculate_capital_efficiency(0, 100) == 100

def test_calculate_risk_exposure():
    # high confidence, no threats, 5+ experience = 80 + 15 = 95
    assert calculate_risk_exposure("High", 0, "5+ years") == 95
    # high confidence, 2 threats, None = 80 - 5 - 20 = 55
    assert calculate_risk_exposure("High", 2, "None") == 55
    # low confidence, 1 threat, 1-3 = 50 + 5 - 10 = 45
    assert calculate_risk_exposure("Low", 1, "1-3 years") == 45

def test_compute_evidence_coverage():
    # empty list
    assert compute_evidence_coverage([]) == {"coverage_pct": 0.0, "overall_confidence": "LOW"}
    # high/med/low
    evidence = [
        {"confidence": "HIGH"},
        {"confidence": "MEDIUM"},
        {"confidence": "LOW"},
        {"confidence": "HIGH"}
    ]
    # total 4. high=2, med=1. pct = (2 + 0.5) / 4 * 100 = 62.5 -> MEDIUM
    res = compute_evidence_coverage(evidence)
    assert res["coverage_pct"] == 62.5
    assert res["overall_confidence"] == "MEDIUM"

def test_generate_verdict():
    # abstention
    assert generate_verdict(90, 20.0).get("is_abstained") is True
    # strong
    assert generate_verdict(80, 100.0)["text"] == "Strong Opportunity"
    # moderate
    assert generate_verdict(60, 100.0)["text"] == "Moderate Potential"
    # high risk
    assert generate_verdict(40, 100.0)["text"] == "High Risk"
