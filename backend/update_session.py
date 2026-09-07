import re

session_service_path = 'd:/yukti/backend/app/services/session_service.py'
with open(session_service_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add scoring_engine import
if 'scoring_engine' not in content:
    content = content.replace('from app.engines.scheme_engine import match_scheme', 'from app.engines.scheme_engine import match_scheme\nfrom app.engines.scoring_engine import compute_all_dimensions\nfrom app.engines.market_intelligence import run_full_market_analysis')

# Update _default_dimension_scores
replacement = '''
def _default_dimension_scores(dscr: float, roi: float, break_even: float, monthly_revenue: float, location_id: str, category_id: str, category_name: str) -> dict:
    try:
        market_data = run_full_market_analysis(location_id, category_id, category_name)
        comp_count = market_data["competitors"]["value"].get("count", 0)
        pop = market_data["market_reach"]["value"].get("consumer_base", 1000) if market_data["market_reach"]["value"] else 1000
        threats_count = len(market_data["threats"]["value"].get("risk_factors", []))
        overall_confidence = market_data["overall_confidence"]
    except Exception:
        comp_count = 2
        pop = 5000
        threats_count = 1
        overall_confidence = "low"

    net_margin = (roi / 12) if roi > 0 else 0
    monthly_units = monthly_revenue / 100 # Approx

    return compute_all_dimensions(
        roi=roi,
        dscr=dscr,
        net_margin=net_margin,
        break_even_units=break_even,
        monthly_units=monthly_units,
        competitor_count=comp_count,
        population=pop,
        overall_confidence=overall_confidence,
        threats_count=threats_count
    )
'''

# Find the old _default_dimension_scores definition and replace it
# We will use regex
content = re.sub(r'def _default_dimension_scores.*?return \{[^\}]+\}', replacement, content, flags=re.DOTALL)

# Update the calls to _default_dimension_scores
content = content.replace('_default_dimension_scores(result["dscr"])', '_default_dimension_scores(result["dscr"], result["roi"], result["break_even_units"], result["monthly_revenue"], session.location_id, session.category_id, session.category_id)')
content = content.replace('_default_dimension_scores(projection.dscr)', '_default_dimension_scores(projection.dscr, projection.roi, projection.break_even_units, projection.monthly_revenue, session.location_id, session.category_id, session.category_id)')

with open(session_service_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated session_service.py to use deterministic scoring_engine.")
