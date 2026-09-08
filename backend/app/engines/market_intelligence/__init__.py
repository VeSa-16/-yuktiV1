"""Market Intelligence orchestrator — fully async with concurrent data fetching."""
import asyncio
import httpx
import logging
from app.data_layer.retrieval import DataRetrieval
from app.engines.market_intelligence.market_reach import estimate_market_reach
from app.engines.market_intelligence.competitor_density import estimate_competitor_density
from app.engines.market_intelligence.pricing import estimate_pricing_band
from app.engines.market_intelligence.opportunity_gaps import analyze_opportunity_gaps_async
from app.engines.market_intelligence.swot import generate_swot_async
from app.engines.market_intelligence.threats import assess_threats_async
from app.services.data_service import data_service
from app.api_clients.gemini_client import GeminiClient

logger = logging.getLogger(__name__)
data_layer = DataRetrieval()
gemini = GeminiClient()


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


async def _get_demographics_async(location_id: str) -> dict:
    """Demographics is now instant (pure algorithmic) — call directly."""
    return data_layer.get_demographics(location_id)


async def _get_competitors_async(location_id: str, category_id: str) -> dict:
    """Fetch competitors via async httpx to avoid blocking the event loop."""
    from app.api_clients.overpass_client import CATEGORY_TAG_MAP
    import math
    lat, lon = data_layer._parse_location(location_id)
    tags = CATEGORY_TAG_MAP.get(category_id, '["shop"]')
    radius_meters = 5000
    query = f"""
    [out:json][timeout:25];
    (
      node{tags}(around:{radius_meters},{lat},{lon});
      way{tags}(around:{radius_meters},{lat},{lon});
      relation{tags}(around:{radius_meters},{lat},{lon});
    );
    out center;
    """
    try:
        async with httpx.AsyncClient(
            headers={"User-Agent": "YUKTI/1.0 (market intelligence; contact@yukti.in)"},
            timeout=7.0
        ) as client:
            response = await client.post("https://overpass-api.de/api/interpreter", data={"data": query})
            response.raise_for_status()
            elements = response.json().get("elements", [])
            competitors = []
            for el in elements:
                el_lat = el.get("lat") or el.get("center", {}).get("lat")
                el_lon = el.get("lon") or el.get("center", {}).get("lon")
                if not el_lat or not el_lon:
                    continue
                t = el.get("tags", {})
                competitors.append({
                    "id": str(el["id"]),
                    "name": t.get("name", "Unnamed Business"),
                    "type": t.get("shop", t.get("craft", category_id)),
                    "latitude": el_lat, "longitude": el_lon,
                    "distance_km": round(math.sqrt((el_lat - lat)**2 + (el_lon - lon)**2) * 111, 2)
                })
            competitors.sort(key=lambda x: x["distance_km"])
            return {"records": competitors, "count": len(competitors), "confidence": "High" if competitors else "Medium"}
    except Exception as e:
        logger.warning(f"Overpass skipped: {e}")
        return {"records": [], "count": 0, "confidence": "Medium"}


async def _get_cost_profile_async(location_id: str, category_id: str) -> dict:
    """Fetches cost profile from Gemini asynchronously."""
    prompt = f"""
    Estimate realistic unit economics for a small business in India in the category '{category_id}'.
    Output ONLY a JSON object exactly matching this schema, with no other text.
    Schema:
    {{
        "fixed_cost_monthly": integer (e.g. rent, salaries, utilities),
        "variable_cost_per_unit": integer (e.g. raw material cost per item or service),
        "selling_price_per_unit": integer (e.g. average selling price to customer),
        "estimated_monthly_revenue": integer,
        "estimated_monthly_units": integer,
        "assumption_note": string (brief explanation of the business model assumed)
    }}
    """
    fallback = {
        "fixed_cost_monthly": 15000,
        "variable_cost_per_unit": 50,
        "selling_price_per_unit": 150,
        "estimated_monthly_revenue": 45000,
        "estimated_monthly_units": 300,
        "assumption_note": "Fallback estimates used."
    }
    result = await gemini.generate_json_async(prompt)
    prof = result if result else fallback
    confidence = "High" if result else "Low"
    return {
        "value": {
            "fixed_cost_monthly": prof.get("fixed_cost_monthly", fallback["fixed_cost_monthly"]),
            "variable_cost_per_unit": prof.get("variable_cost_per_unit", fallback["variable_cost_per_unit"]),
            "selling_price_per_unit": prof.get("selling_price_per_unit", fallback["selling_price_per_unit"]),
            "estimated_monthly_revenue": prof.get("estimated_monthly_revenue", fallback["estimated_monthly_revenue"]),
            "estimated_monthly_units": prof.get("estimated_monthly_units", fallback["estimated_monthly_units"]),
        },
        "confidence": confidence,
        "data_origin": "Gemini AI Estimation",
        "note": prof.get("assumption_note", "No assumptions provided."),
    }


async def run_full_market_analysis_async(location_id: str, category_id: str, category_name: str, 
                                       budget: int = None, experience: str = None, idea_details: str = None) -> dict:
    """Fully async orchestrator — fetches all data sources concurrently."""

    # ─── Phase 1: Fetch raw data in parallel ──────────────────────────────────
    demo_result, comp_result, cost_result, pricing_result = await asyncio.gather(
        _get_demographics_async(location_id),
        _get_competitors_async(location_id, category_id),
        _get_cost_profile_async(location_id, category_id),
        data_layer.get_prices_async(location_id, category_id),
    )

    demographics = demo_result.get("value")
    comp_val = {
        "count": comp_result.get("value", {}).get("count", 0),
        "records": comp_result.get("value", {}).get("records", [])
    }
    cost_value = cost_result.get("value")
    
    # Calculate derived inputs
    consumer_base = demographics.get("population_radius", 0) if demographics else 0
    comp_count = comp_val["count"]
    overall_confidence = "Medium"

    # Context string to inject into AI prompts
    user_context = f"User Budget: {budget}. Experience: {experience}. Details: {idea_details}." if budget else ""

    gemini = GeminiClient()
    
    # ─── Phase 2: AI inferences in parallel ───────────────────────────────────
    gap_result, swot_result, threats_result = await asyncio.gather(
        analyze_opportunity_gaps_async(consumer_base, comp_count, category_name, gemini, confidence="Medium", user_context=user_context),
        generate_swot_async(category_name, comp_count, None, pricing_result, cost_value, demographics, gemini, confidence=overall_confidence, user_context=user_context),
        assess_threats_async(comp_count, None, category_name, pricing_result, gemini, confidence=overall_confidence, user_context=user_context),
    )

    # ─── Phase 3: Assemble response ───────────────────────────────────────────
    reach_val = estimate_market_reach(demographics)
    market_reach = wrap_with_provenance(
        reach_val,
        "market_metrics",
        demo_result.get("confidence", "low"),
        method="Estimated by applying 70% addressable filter to local population radius."
    )

    competitors = wrap_with_provenance(
        comp_val,
        "competitors",
        comp_result.get("confidence", "low"),
        method="Radius search on OSM and verified local directories."
    )

    pricing = wrap_with_provenance(
        pricing_result.get("value", {"low": 0, "high": 0, "unit": ""}),
        "prices",
        pricing_result.get("confidence", "low"),
        method="Agmarknet modal prices + AI estimation."
    )

    opportunity_gaps = wrap_with_provenance(
        gap_result,
        "competitors",
        "medium",
        method="AI-assessed demand vs supply opportunity ratio."
    )

    swot = wrap_with_provenance(
        swot_result,
        "market_metrics",
        overall_confidence,
        method="AI-generated SWOT from live market signals."
    )

    threats = wrap_with_provenance(
        threats_result,
        "competitors",
        overall_confidence,
        method="AI risk assessment from competition density and pricing spread."
    )

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


def run_full_market_analysis(location_id: str, category_id: str, category_name: str) -> dict:
    """Sync wrapper — runs the async orchestrator in a new event loop if needed."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # We're inside an async context (FastAPI), use run_coroutine_threadsafe
            import concurrent.futures
            future = asyncio.ensure_future(
                run_full_market_analysis_async(location_id, category_id, category_name)
            )
            return asyncio.get_event_loop().run_until_complete(future)
    except Exception:
        pass
    return asyncio.run(run_full_market_analysis_async(location_id, category_id, category_name))


def _aggregate_confidence(levels: list) -> str:
    levels = [lvl.lower() for lvl in levels if lvl]
    if "low" in levels:
        return "low"
    if "medium" in levels:
        return "medium"
    return "high"
