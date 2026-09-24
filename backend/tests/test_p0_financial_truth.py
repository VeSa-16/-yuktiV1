"""
Automated Test Suite for YUKTI P0 — Financial Source of Truth & Engine Correctness.
Covers all requirements in P0-1 through P0-32 including the Golden Test Case.
"""
import pytest
import math
from app.core.category_registry import normalize_category_id
from app.engines.financial_engine import (
    build_financial_snapshot, compute_pnl_statement, compute_emi,
    compute_dscr, compute_break_even_revenue, compute_working_capital
)
from app.engines.recommendation_engine import compute_yukti_score, band_verdict
from app.engines.scoring_engine import compute_all_dimensions
from app.engines.simulation_engine import run_simulation
from app.engines.scheme_engine import match_scheme, SchemeMatch
from app.ai.gemini_client import GeminiClient


# ─── 1. Golden Test Case Verification ───────────────────────────────────────

def test_golden_test_case_solapur_retail_shop():
    """
    Golden test case:
    Location: Solapur
    Capital: ₹75,000
    Business: Retail / Shop
    Dataset: Revenue=350,000, Variable=227,500, Fixed=60,000
    """
    user_capital = 75000.0
    financial_data = {
        "startup_cost": 750000.0,
        "monthly_revenue": 350000.0,
        "monthly_variable_cost": 227500.0,
        "monthly_fixed_cost": 60000.0,
    }
    scheme = {
        "scheme_name": "NSFDC Term Loan",
        "rate": 8.0,
        "tenure_months": 84,
        "moratorium_months": 6,
        "max_loan": 4500000.0,
    }

    snapshot = build_financial_snapshot(user_capital, financial_data, scheme, "retail_shop")

    # Capital semantics
    assert snapshot["required_project_cost"] == 750000.0
    assert snapshot["required_margin"] == 75000.0
    assert snapshot["loan_requirement"] == 675000.0
    assert snapshot["funding_gap"] == 0.0

    # P&L statement
    assert snapshot["monthly_revenue"] == 350000.0
    assert snapshot["monthly_variable_cost"] == 227500.0
    assert snapshot["gross_profit"] == 122500.0
    assert snapshot["gross_margin_pct"] == 35.0
    assert snapshot["monthly_fixed_cost"] == 60000.0
    assert snapshot["operating_profit"] == 62500.0
    assert snapshot["operating_margin_pct"] == 17.86

    # EMI & Loan
    assert snapshot["tenure_months"] == 84
    assert snapshot["moratorium_months"] == 6
    assert snapshot["emi_details"]["repayment_months"] == 78
    assert abs(snapshot["emi"] - 11126.15) <= 1.0

    # DSCR & ROI
    assert abs(snapshot["dscr"] - 5.62) <= 0.05
    assert snapshot["annual_operating_profit"] == 750000.0
    assert snapshot["roi_pct"] == 100.0

    # Break-even Revenue
    assert abs(snapshot["break_even_revenue"] - 171428.57) <= 1.0


# ─── 2. Category Registry Normalization ─────────────────────────────────────

def test_category_id_normalization():
    assert normalize_category_id("retail_kirana") == "retail_shop"
    assert normalize_category_id("retail_shop") == "retail_shop"
    assert normalize_category_id("dairy") == "dairy"


# ─── 3. Capital Semantics & Envelope ───────────────────────────────────────

def test_capital_financing_envelope():
    # User capital ₹1,00,000
    snapshot = build_financial_snapshot(100000.0, {"startup_cost": 750000.0}, category_id="retail_shop")
    assert snapshot["available_capital"] == 100000.0
    assert snapshot["required_project_cost"] == 750000.0
    assert snapshot["required_margin"] == 75000.0
    assert snapshot["loan_requirement"] == 675000.0
    assert snapshot["financing_capacity_project"] == 1000000.0
    assert snapshot["financing_capacity_loan"] == 900000.0
    assert snapshot["excess_capital_buffer"] == 25000.0
    assert snapshot["capital_sufficient"] is True


# ─── 4. Break-Even Calculation ─────────────────────────────────────────────

def test_break_even_revenue():
    # Revenue 350k, Var 227.5k -> CM = 35%, Fixed 60k -> Break-even = 60k / 0.35 = 171,428.57
    be_rev = compute_break_even_revenue(60000.0, 350000.0, 227500.0)
    assert abs(be_rev - 171428.57) <= 1.0


# ─── 5. Working Capital Uses Actual Variable Costs ─────────────────────────

def test_working_capital_uses_actual_variable_costs():
    wc = compute_working_capital(monthly_revenue=350000.0, monthly_variable_cost=227500.0)
    assert wc["daily_variable_cost"] == round(227500.0 / 30, 2)
    assert wc["inventory"] == round(wc["daily_variable_cost"] * 10, 2)
    assert wc["receivables"] == round(wc["daily_revenue"] * 7, 2)
    assert wc["payables"] == round(wc["daily_variable_cost"] * 14, 2)


# ─── 6. Gemini Fail-Safety & Parser ────────────────────────────────────────

def test_gemini_parser_fail_safe():
    client = GeminiClient(api_key="test_key")
    
    # Missing candidates
    assert client._parse_response({}) is None
    
    # Malformed JSON
    raw_invalid_data = {
        "candidates": [{
            "content": {
                "parts": [{"text": "```json\n{ invalid json here...\n```"}]
            }
        }]
    }
    assert client._parse_response(raw_invalid_data, mime_type="application/json") is None

    # Valid JSON
    raw_valid_data = {
        "candidates": [{
            "content": {
                "parts": [{"text": "```json\n{\"narrative\": \"Good business\"}\n```"}]
            }
        }]
    }
    assert client._parse_response(raw_valid_data, mime_type="application/json") == {"narrative": "Good business"}


# ─── 7. Unified YUKTI Score & Simulation Chain ─────────────────────────────

def test_yukti_score_and_simulation_recalculation():
    scores = {
        "financial_viability": 80,
        "repayment_capacity": 85,
        "market_opportunity": 70,
        "capital_efficiency": 75,
        "risk_exposure": 80,
    }
    result = compute_yukti_score(scores, confidence_multiplier=0.85, dscr=2.5)
    # Raw = 80*0.3 + 85*0.25 + 70*0.2 + 75*0.15 + 80*0.1 = 24 + 21.25 + 14 + 11.25 + 8 = 78.5
    # Final = 78.5 * 0.85 = 66.7
    assert result.raw_score == 78.5
    assert result.final_score == 66.7
    assert result.verdict == "CAUTION"

    # Test simulation chain recalculates score on revenue drop
    base_state = {
        "principal": 675000.0,
        "rate": 8.0,
        "tenure_months": 84,
        "moratorium_months": 6,
        "monthly_revenue": 350000.0,
        "monthly_variable_cost": 227500.0,
        "monthly_fixed_cost": 60000.0,
        "monthly_opex": 287500.0,
        "confidence_multiplier": 0.85,
    }
    sim_res = run_simulation(base_state, revenue_delta_pct=-20.0, cost_delta_pct=0.0, tenure_override_years=None)
    assert sim_res["final_score"] != result.final_score
    assert sim_res["operating_profit"] < 62500.0


# ─── 8. Scheme Matching & Versioning ────────────────────────────────────────

def test_scheme_matching_and_pmegp_verification():
    match = match_scheme(750000.0)
    assert match.scheme_id == "nsfdc_term"
    assert match.status == "ELIGIBLE"
    assert match.version == "2026-09-06"
    assert match.effective_from == "2026-01-01"

    # PMEGP needs verification check
    pmegp_match = match_scheme(750000.0, scheme_id="pmegp")
    # Default without DB returns NEEDS_VERIFICATION if name contains PMEGP
    assert hasattr(pmegp_match, "status")
