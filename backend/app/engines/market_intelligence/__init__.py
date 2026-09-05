"""
Market Intelligence Aggregator — runs all sub-modules and assembles results.
This is the single entry point the services layer calls.
"""
from app.data_layer.retrieval import DataRetrieval
from app.engines.market_intelligence.market_reach import estimate_market_reach
from app.engines.market_intelligence.competitor_density import estimate_competitor_density
from app.engines.market_intelligence.pricing import estimate_pricing_band
from app.engines.market_intelligence.opportunity_gaps import analyze_opportunity_gaps
from app.engines.market_intelligence.swot import generate_swot
from app.engines.market_intelligence.threats import assess_threats


data_layer = DataRetrieval()


def run_full_market_analysis(location_id: str, category_id: str, category_name: str) -> dict:
    """
    Run all market intelligence sub-engines for a location+category pair.
    Returns a unified result dict with all analyses and their confidence tags.
    """
    # 1. Demographics & Market Reach
    demo_result = data_layer.get_demographics(location_id)
    demographics = demo_result.get("value") if demo_result.get("value") and isinstance(demo_result["value"], dict) else None
    market_reach = estimate_market_reach(demographics)

    # 2. Competitors
    comp_result = data_layer.get_competitors(location_id, category_id)
    competitor_count = comp_result.get("count", 0)
    comp_confidence = comp_result.get("confidence", "Low")

    # 3. Pricing
    pricing_result = data_layer.get_pricing(location_id, category_id)

    # 4. Opportunity Gaps
    consumer_base = market_reach.get("consumer_base")
    gap_result = analyze_opportunity_gaps(
        consumer_base, competitor_count, category_name,
        confidence=comp_confidence,
    )

    # 5. SWOT
    cost_result = data_layer.get_cost_profile(location_id, category_id)
    cost_value = cost_result.get("value") if cost_result.get("confidence") != "Low" or cost_result.get("value") else None
    overall_confidence = _aggregate_confidence([
        market_reach.get("confidence", "Low"),
        comp_confidence,
        pricing_result.get("confidence", "Low"),
    ])
    swot = generate_swot(
        category_name, competitor_count, gap_result.get("gap_score"),
        pricing_result, cost_value, demographics,
        confidence=overall_confidence,
    )

    # 6. Threats
    threats = assess_threats(
        competitor_count, gap_result.get("gap_score"),
        category_name, pricing_result,
        confidence=overall_confidence,
    )

    return {
        "location_id": location_id,
        "category_id": category_id,
        "category_name": category_name,
        "market_reach": market_reach,
        "competitors": {
            "count": competitor_count,
            "records": comp_result.get("records", []),
            "confidence": comp_confidence,
        },
        "pricing": pricing_result,
        "opportunity_gaps": gap_result,
        "swot": swot,
        "threats": threats,
        "overall_confidence": overall_confidence,
    }


def _aggregate_confidence(levels: list[str]) -> str:
    """Aggregate multiple confidence levels — weakest link wins."""
    if "Low" in levels:
        return "Low"
    if "Medium" in levels:
        return "Medium"
    return "High"
