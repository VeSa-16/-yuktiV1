from app.data_layer.retrieval import DataRetrieval
from app.engines.market_intelligence.market_reach import estimate_market_reach
from app.engines.market_intelligence.competitor_density import estimate_competitor_density
from app.engines.market_intelligence.pricing import estimate_pricing_band
from app.engines.market_intelligence.opportunity_gaps import analyze_opportunity_gaps
from app.engines.market_intelligence.swot import generate_swot
from app.engines.market_intelligence.threats import assess_threats
from app.services.data_service import data_service

data_layer = DataRetrieval()

def wrap_with_provenance(value, dataset_name, confidence_override=None, method=None):
    prov = data_service.get_provenance_for_dataset(dataset_name)
    if confidence_override:
        prov.confidence = confidence_override
    if method:
        prov.methodology = method
    return {
        "value": value,
        "provenance": prov.dict()
    }

def run_full_market_analysis(location_id: str, category_id: str, category_name: str) -> dict:
    # 1. Demographics & Market Reach
    demo_result = data_layer.get_demographics(location_id)
    demographics = demo_result.get("value")
    reach_val = estimate_market_reach(demographics)
    market_reach = wrap_with_provenance(
        reach_val, 
        "market_metrics", 
        demo_result.get("confidence", "low"),
        method="Estimated by applying 70% addressable filter to local population radius."
    )

    # 2. Competitors
    comp_result = data_layer.get_competitors(location_id, category_id)
    comp_val = {
        "count": comp_result.get("count", 0),
        "records": comp_result.get("records", [])
    }
    competitors = wrap_with_provenance(
        comp_val, 
        "competitors", 
        comp_result.get("confidence", "low"),
        method="Radius search on OSM and verified local directories."
    )

    # 3. Pricing
    pricing_result = data_layer.get_pricing(location_id, category_id)
    pricing = wrap_with_provenance(
        pricing_result.get("value", {"low": 0, "high": 0, "unit": ""}), 
        "prices", 
        pricing_result.get("confidence", "low"),
        method="Agmarknet modal prices + 10% standard deviation."
    )

    # 4. Opportunity Gaps
    consumer_base = reach_val.get("consumer_base") if reach_val else 0
    comp_count = comp_val["count"]
    gap_val = analyze_opportunity_gaps(consumer_base, comp_count, category_name, confidence="Medium")
    opportunity_gaps = wrap_with_provenance(
        gap_val, 
        "competitors", 
        "medium",
        method="Calculated as ratio of target population divided by (1 + competitor density)."
    )

    # 5. SWOT
    cost_result = data_layer.get_cost_profile(location_id, category_id)
    cost_value = cost_result.get("value")
    overall_confidence = _aggregate_confidence([
        demo_result.get("confidence", "Low"),
        comp_result.get("confidence", "Low"),
        pricing_result.get("confidence", "Low")
    ])
    swot_val = generate_swot(category_name, comp_count, gap_val.get("gap_score"), pricing_result, cost_value, demographics, confidence=overall_confidence)
    swot = wrap_with_provenance(swot_val, "market_metrics", overall_confidence, method="Deterministic analysis of cost, density, and population signals.")

    # 6. Threats
    threats_val = assess_threats(comp_count, gap_val.get("gap_score"), category_name, pricing_result, confidence=overall_confidence)
    threats = wrap_with_provenance(threats_val, "competitors", overall_confidence, method="Risk flagging based on margin pressures and supplier distance.")

    return {
        "location_id": location_id,
        "category_id": category_id,
        "category_name": category_name,
        "market_reach": market_reach,
        "competitors": competitors,
        "pricing": pricing,
        "opportunity_gaps": opportunity_gaps,
        "swot": swot,
        "threats": threats,
        "overall_confidence": overall_confidence.lower(),
    }

def _aggregate_confidence(levels: list[str]) -> str:
    levels = [lvl.lower() for lvl in levels if lvl]
    if "low" in levels:
        return "low"
    if "medium" in levels:
        return "medium"
    return "high"

