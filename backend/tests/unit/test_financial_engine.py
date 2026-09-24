import pytest
from app.engines.financial_engine import (
    compute_emi,
    compute_dscr,
    compute_break_even_units,
    compute_net_profit,
    compute_roi,
    compute_project_cost,
    compute_loan_amount
)

def test_compute_project_cost():
    # Margin is 10%, project cost = margin / 0.1
    assert compute_project_cost(25000) == 250000.0
    with pytest.raises(ValueError):
        compute_project_cost(0)

def test_compute_loan_amount():
    assert compute_loan_amount(100000) == 90000.0
    # With scheme max loan limit
    assert compute_loan_amount(100000, 50000) == 50000.0
    assert compute_loan_amount(0) == 0.0

def test_compute_emi_standard():
    emi = compute_emi(100000, 12.0, 12)
    assert round(emi, 2) == 8884.88

def test_compute_emi_zero_interest():
    emi = compute_emi(120000, 0.0, 12)
    assert emi == 10000.0

def test_compute_emi_edge_cases():
    assert compute_emi(0, 12.0, 12) == 0.0
    with pytest.raises(ValueError):
        compute_emi(100000, 12.0, 0)

def test_compute_dscr():
    assert compute_dscr(20000, 10000) == 2.0
    assert compute_dscr(20000, 0) == float('inf')
    assert compute_dscr(-5000, 10000) == -0.5

def test_compute_break_even_units():
    assert compute_break_even_units(10000, 100, 50) == 200
    with pytest.raises(ValueError):
        compute_break_even_units(10000, 50, 100)
    with pytest.raises(ValueError):
        compute_break_even_units(10000, 0, 0)

def test_compute_net_profit():
    assert compute_net_profit(50000, 30000) == 20000.0
    assert compute_net_profit(20000, 30000) == -10000.0

def test_compute_roi():
    assert compute_roi(20000, 100000) == 20.0
    assert compute_roi(20000, 0) == 0.0
