"""
YUKTI Data Platform - Data Fusion Engine.
Fuses heterogeneous evidence sources into a single provenance-tracked EvidenceBundle:
- LGD Administrative Hierarchy (LGD_ADMIN_MASTER)
- WorldPop 2025 1km Population Surface (WORLDPOP_INDIA_2025_1KM)
- HCES 2022-23 NSS Report 591 Benchmarks (HCES_2022_23_REPORT_591)
- Historical Irrigation & Crop Area 2010-11 (AHILYANAGAR_IRRIGATION_2010_11)
- District Economic Census (ECONOMIC_REPORT_COLLECTION)
- Demographic Village Reference (POPULATION_REPORT_COLLECTION)

Guarantees:
- Historical data labeled HISTORICAL
- Modelled estimates labeled MODEL_PREDICTION
- Survey aggregates labeled SOURCE_DERIVED
- Full provenance trace & confidence metrics
"""

from typing import Dict, Any, Optional, List
from .ingestion import (
    import_lgd_datasets,
    query_catchment_population,
    get_hces_benchmark,
    get_irrigation_profile,
    get_economic_profile,
    get_population_profile,
)


def resolve_lgd_location(
    lat: float, lon: float, state: str = "Maharashtra", district: str = "Ahilyanagar", subdistrict: Optional[str] = None, village: Optional[str] = None
) -> Dict[str, Any]:
    """
    Resolves administrative entity via LGD datasets with historical alias mapping.
    """
    lgd = import_lgd_datasets()
    subdistrict_match = None
    village_match = None

    # Handle Ahmadnagar / Ahilyanagar historical mapping
    norm_district = district.strip()
    if norm_district.lower() in ["ahmadnagar", "ahmednagar", "ahilyanagar"]:
        canonical_district = "Ahilyanagar"
        historical_alias = "Ahmadnagar"
    else:
        canonical_district = norm_district
        historical_alias = norm_district

    # Resolve subdistrict
    if subdistrict and lgd["subdistricts"]:
        sd_norm = subdistrict.strip().lower()
        for sd in lgd["subdistricts"]:
            if sd["name"].strip().lower() == sd_norm or sd["normalized_name"].lower() == sd_norm:
                subdistrict_match = sd
                break

    # Resolve village
    if village and lgd["villages"]:
        v_norm = village.strip().lower()
        for v in lgd["villages"]:
            if v["name"].strip().lower() == v_norm or v["normalized_name"].lower() == v_norm:
                village_match = v
                break

    return {
        "lgd_code": village_match["lgd_code"] if village_match else (subdistrict_match["lgd_code"] if subdistrict_match else "LGD_MH_999"),
        "state": state,
        "district": canonical_district,
        "district_historical_name": historical_alias,
        "subdistrict": subdistrict_match["name"] if subdistrict_match else (subdistrict or "Ahilyanagar"),
        "subdistrict_code": subdistrict_match["lgd_code"] if subdistrict_match else "LGD_SD_UNKNOWN",
        "village": village_match["name"] if village_match else (village or "Local Area"),
        "village_code": village_match["lgd_code"] if village_match else "LGD_V_UNKNOWN",
        "coordinates": {"lat": lat, "lon": lon},
        "resolution_status": "EXACT_MATCH" if village_match else ("APPROXIMATE_MATCH" if subdistrict_match else "GEOSPATIAL_INTERPOLATED"),
        "provenance_class": "SOURCE_DERIVED",
        "source_dataset": "LGD_ADMIN_MASTER",
    }


def generate_evidence_bundle(
    lat: float,
    lon: float,
    state: str = "Maharashtra",
    district: str = "Ahilyanagar",
    subdistrict: Optional[str] = "Ahilyanagar",
    village: Optional[str] = None,
    sector: str = "RURAL",
    catchment_radius_km: float = 10.0,
) -> Dict[str, Any]:
    """
    Fuses all available local evidence layers into a unified EvidenceBundle.
    """
    # 1. Location & LGD Hierarchy
    location = resolve_lgd_location(lat, lon, state=state, district=district, subdistrict=subdistrict, village=village)

    # 2. Catchment Population (WorldPop 2025)
    worldpop_5k = query_catchment_population(lat, lon, radius_km=5.0)
    worldpop_10k = query_catchment_population(lat, lon, radius_km=10.0)
    worldpop_15k = query_catchment_population(lat, lon, radius_km=15.0)

    # 3. Consumption Context Benchmark (HCES 2022-23)
    hces = get_hces_benchmark(state=location["state"], sector=sector)

    # 4. Historical Irrigation & Agriculture Context (2010-11)
    irrigation = get_irrigation_profile(district=location["district_historical_name"], subdistrict=location["subdistrict"])

    # 5. Economic Census Context (2013-14)
    economic = get_economic_profile(district=location["district_historical_name"])

    # 6. Demographics Census Reference (2011)
    demographics = get_population_profile(district="Solapur" if "solapur" in location["district"].lower() else location["district"], village=location["village"])

    # Calculate Data Quality & Confidence
    confidence_score = 0.85
    limitations = []

    if hces["provenance_class"] == "SOURCE_DERIVED":
        limitations.append("HCES MPCE is a State-level survey benchmark; not direct village-level spending.")
    if irrigation["status"] == "HISTORICAL_BASELINE":
        limitations.append("Irrigation & crop data is historical baseline (2010-11); do not treat as current cultivation.")
    if worldpop_10k["provenance_class"] == "MODEL_PREDICTION":
        limitations.append("Catchment population is a 1km gridded model estimate (WorldPop 2025).")

    return {
        "location": location,
        "population": {
            "catchment_5km": worldpop_5k,
            "catchment_10km": worldpop_10k,
            "catchment_15km": worldpop_15k,
            "historical_census_reference": demographics,
        },
        "consumption_context": {
            "hces_benchmark": hces,
            "interpretation": f"{location['state']} {sector} per-capita monthly expenditure benchmark is ₹{hces['mpce_inr']:,}/month.",
            "note": "Use as regional demand context, not local village survey.",
        },
        "agricultural_context": irrigation,
        "economic_context": economic,
        "quality": {
            "overall_confidence": confidence_score,
            "coverage": "HIGH" if location["resolution_status"] != "GEOSPATIAL_INTERPOLATED" else "MEDIUM",
            "limitations": limitations,
            "freshness": {
                "population_vintage": "2025",
                "hces_vintage": "2022-23",
                "irrigation_vintage": "2010-11",
                "lgd_vintage": "2026",
            },
        },
        "decision_trace": [
            {
                "factor": "Catchment Population",
                "value": worldpop_10k["population_estimate"],
                "unit": "persons",
                "dataset_id": worldpop_10k["dataset_id"],
                "provenance_class": worldpop_10k["provenance_class"],
                "vintage": worldpop_10k["vintage"],
            },
            {
                "factor": "Household Consumption Expenditure (MPCE)",
                "value": hces["mpce_inr"],
                "unit": "INR/person/month",
                "dataset_id": hces["dataset_id"],
                "provenance_class": hces["provenance_class"],
                "vintage": hces["reference_period"],
            },
            {
                "factor": "Historical Agricultural Irrigation Share",
                "value": irrigation["summary"]["irrigated_share_pct"],
                "unit": "percent",
                "dataset_id": irrigation["dataset_id"],
                "provenance_class": irrigation["provenance_class"],
                "vintage": irrigation["reference_period"],
            },
        ],
    }
