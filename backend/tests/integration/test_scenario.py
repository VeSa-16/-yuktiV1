import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_deps():
    with patch("app.api.routes_analysis.match_business_category") as mock_match, \
         patch("app.api.routes_analysis.DataRetrieval") as mock_retrieval, \
         patch("app.api.routes_analysis.GeminiClient") as mock_gemini:
        
        mock_match.return_value = {"matched_category_id": "retail_kirana", "confidence": 0.9}
        
        instance = mock_retrieval.return_value
        instance.get_category_data.return_value = {
            "initial_setup_costs": {"total_setup_cost": 100000},
            "pricing_margins": {"average_margin_percentage": 20.0},
            "monthly_running_costs": {"total_fixed_costs": 20000},
            "unit_economics": {
                "expected_monthly_revenue": 100000,
                "variable_costs": 60000,
                "net_operating_income": 20000
            },
            "competitor_market_data": {"competitor_count": 5},
            "qualitative_insights": {},
            "seasonality_and_demand_trend": {},
            "risk_rating": {}
        }
        
        async def mock_async_json(*args, **kwargs):
            return {}
            
        gemini_instance = mock_gemini.return_value
        gemini_instance.generate_json_async.side_effect = mock_async_json
        
        yield

def test_scenario_multipliers_cascade(mock_deps):
    payload_base = {
        "profile": {"name": "Test User", "age": 30, "gender": "Male", "social_category": "General"},
        "location": {"id": "solapur_rural", "display_name": "Solapur", "district": "Solapur", "state": "MH"},
        "business": {"category": "retail", "idea": "kirana", "experience": "None"},
        "capital": {"investment_amount": 100000, "source": "own"},
        "mode": "simulation",
        "scenario": {}
    }
    
    # 1. Base scenario
    resp1 = client.post("/api/analysis/generate", json=payload_base, headers={"X-API-Key": "yukti-demo-key"})
    assert resp1.status_code == 200, resp1.text
    data1 = resp1.json()["financials"]
    base_revenue = data1["monthly_revenue"]
    base_dscr = data1["dscr"]
    base_breakeven = data1["break_even_monthly_revenue"]
    
    # 2. Demand shock scenario (50% drop in demand)
    payload_shock = dict(payload_base)
    payload_shock["scenario"] = {"demand_multiplier": 0.5, "cost_multiplier": 1.0, "price_multiplier": 1.0}
    
    resp2 = client.post("/api/analysis/generate", json=payload_shock, headers={"X-API-Key": "yukti-demo-key"})
    assert resp2.status_code == 200, resp2.text
    data2 = resp2.json()["financials"]
    
    # Assert downstream cascade changed correctly
    assert data2["monthly_revenue"] == base_revenue * 0.5
    assert data2["break_even_monthly_revenue"] == base_breakeven  # BE units depends on fixed cost and contribution margin, so it shouldn't change with just a demand drop!
    assert data2["dscr"] < base_dscr  # DSCR should drop because NOI drops due to lower revenue

    # 3. Cost shock scenario (fixed costs go up, VC goes up -> modeled via cost_mult on fixed costs?)
    # Let's test price multiplier
    payload_price = dict(payload_base)
    payload_price["scenario"] = {"demand_multiplier": 1.0, "cost_multiplier": 1.0, "price_multiplier": 1.2}
    
    resp3 = client.post("/api/analysis/generate", json=payload_price, headers={"X-API-Key": "yukti-demo-key"})
    assert resp3.status_code == 200, resp3.text
    data3 = resp3.json()["financials"]
    
    assert data3["monthly_revenue"] == base_revenue * 1.2
    assert data3["net_profit"] > data1["net_profit"]
