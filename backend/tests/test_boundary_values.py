import pytest
from app.engines.financial_engine import compute_project_cost, compute_loan_amount
from app.engines.scheme_engine import match_scheme, MICRO_FINANCE_CEILING, TERM_LOAN_CEILING

# Encodes the exact table from Section 17.1
@pytest.mark.parametrize("margin,expected_scheme", [
    (14_000, "Micro Credit Finance"),      # exactly at boundary — inclusive
    (14_001, "Term Loan"),                 # just above — exclusive
    (100_000, "Term Loan"),
    (500_000, "Term Loan"),                # PC = 50L exactly, at ceiling
    (600_000, None),                       # PC = 60L, exceeds both schemes
])
def test_boundary_routing(margin, expected_scheme):
    pc = compute_project_cost(margin)
    result = match_scheme(pc)
    if expected_scheme is None:
        assert result.matched is False
    else:
        assert result.scheme_name == expected_scheme

def test_project_cost_formula():
    assert compute_project_cost(100_000) == 1_000_000

def test_loan_capped_at_term_loan_ceiling():
    pc = compute_project_cost(500_000)  # PC = 50,00,000
    result = match_scheme(pc)
    assert result.max_loan == 4_500_000  # capped at ₹45L even though 90% of PC is 45L exactly here

def test_zero_margin_raises():
    with pytest.raises(ValueError):
        compute_project_cost(0)
