import json
import logging
import math
from pathlib import Path
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

DATASET_FILE  = Path(__file__).parent.parent.parent / "data" / "processed" / "solapur_combined.json"
CENSUS_FILE   = Path(__file__).parent.parent.parent / "data" / "processed" / "solapur_villages.json"
LOCATIONS_FILE = Path(__file__).parent.parent.parent / "data" / "processed" / "solapur_locations.json"

def _load_json(path: Path) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load {path}: {e}")
        return {}

DATASET    = _load_json(DATASET_FILE)
CENSUS     = _load_json(CENSUS_FILE)     # populated by extract_solapur_census.py
LOCATIONS  = _load_json(LOCATIONS_FILE)  # populated by extract_lgd_locations.py

# Index: lowercase village name → census record
VILLAGE_INDEX: Dict[str, dict] = {}
for key, val in CENSUS.get("villages", {}).items():
    VILLAGE_INDEX[key.lower()] = val
    # Also index by name field directly
    if val.get("name"):
        VILLAGE_INDEX[val["name"].lower()] = val

# Index: lowercase taluka name → census record
TALUKA_INDEX: Dict[str, dict] = {}
for key, val in CENSUS.get("talukas", {}).items():
    TALUKA_INDEX[key.lower()] = val
    if val.get("name"):
        TALUKA_INDEX[val["name"].lower()] = val


def _find_village(query: str) -> Optional[dict]:
    """Try exact then partial match in Census village index."""
    q = query.lower().strip()
    if q in VILLAGE_INDEX:
        return VILLAGE_INDEX[q]
    # Partial match
    for key, val in VILLAGE_INDEX.items():
        if q in key or key in q:
            return val
    return None


def _find_taluka(query: str) -> Optional[dict]:
    """Try exact then partial match in Census taluka index."""
    q = query.lower().strip()
    if q in TALUKA_INDEX:
        return TALUKA_INDEX[q]
    for key, val in TALUKA_INDEX.items():
        if q in key or key in q:
            return val
    return None


def _gravity_multiplier(loc_lower: str) -> float:
    """Returns a gravity score based on settlement type."""
    if "solapur" in loc_lower:
        return 4.0   # Major city
    if any(x in loc_lower for x in ["barshi", "pandharpur", "akluj", "akkalkot", "mangalvedha"]):
        return 2.5   # Taluka HQ / significant town
    return 1.2       # Rural village


def estimate_consumer_base(village_or_taluka: str, district: str) -> Dict[str, Any]:
    """
    Computes estimated consumer base within 5km and 10km radius.

    Priority:
    1. Real Census 2011 village data  (solapur_villages.json)
    2. Real Census 2011 taluka data   (solapur_villages.json)
    3. District-level heuristic       (solapur_combined.json)
    """
    loc_lower = (village_or_taluka or "").lower().strip()

    area_5km  = math.pi * (5 ** 2)   # 78.54 sq km
    area_10km = math.pi * (10 ** 2)  # 314.16 sq km
    gravity   = _gravity_multiplier(loc_lower)

    # ── 1. Village-level Census match ────────────────────────────────────────
    village_rec = _find_village(loc_lower)
    if village_rec and village_rec.get("population_2011", 0) > 0:
        pop_2011 = village_rec["population_2011"]
        # Grow 2011 → 2026 at ~1.2% per year (compound, 15 years ≈ 19.6% growth)
        pop_2026 = round(pop_2011 * 1.196)
        # Village assumed to cover ~5 sq km (approximate)
        density = pop_2026 / 5.0

        logger.info(f"[demand_model] Census village match: {village_rec.get('name')} pop={pop_2011}")
        return {
            "local_consumer_base_5km":  round(area_5km  * density * gravity),
            "local_consumer_base_10km": round(area_10km * density * gravity * 0.8),
            "model_density":             round(density),
            "gravity_multiplier":        gravity,
            "data_source":               "Census 2011 — village-level (real)",
            "confidence":                "Medium",  # 2011 data, not current
            "village_population_2011":   pop_2011,
            "village_households_2011":   village_rec.get("households_2011", 0),
            "village_name_matched":      village_rec.get("name", village_or_taluka),
        }

    # ── 2. Taluka-level Census match ─────────────────────────────────────────
    taluka_rec = _find_taluka(loc_lower)
    if taluka_rec and taluka_rec.get("population_2011", 0) > 0:
        pop_2011 = taluka_rec["population_2011"]
        pop_2026 = round(pop_2011 * 1.196)
        # Typical Solapur taluka area ~1200 sq km
        density  = pop_2026 / 1200.0

        logger.info(f"[demand_model] Census taluka match: {taluka_rec.get('name')} pop={pop_2011}")
        return {
            "local_consumer_base_5km":  round(area_5km  * density * gravity),
            "local_consumer_base_10km": round(area_10km * density * gravity * 0.8),
            "model_density":             round(density),
            "gravity_multiplier":        gravity,
            "data_source":               "Census 2011 — taluka-level (real)",
            "confidence":                "Medium",
            "taluka_population_2011":    pop_2011,
            "taluka_households_2011":    taluka_rec.get("households_2011", 0),
            "taluka_name_matched":       taluka_rec.get("name", village_or_taluka),
        }

    # ── 3. District-level heuristic (original fallback) ─────────────────────
    district_data = DATASET.get("district_overview", {})
    district_pop  = district_data.get("demographics", {}).get("district_population_estimated_2026", 4954000)
    district_area = district_data.get("geography",   {}).get("total_area_sq_km", 14895)
    density       = district_pop / district_area if district_area else 332

    logger.warning(f"[demand_model] No Census match for '{village_or_taluka}' — using district heuristic")
    return {
        "local_consumer_base_5km":  round(area_5km  * density * gravity),
        "local_consumer_base_10km": round(area_10km * density * gravity * 0.8),
        "model_density":             round(density),
        "gravity_multiplier":        gravity,
        "data_source":               "District heuristic (Census village not found)",
        "confidence":                "Low",
    }


def estimate_consumer_base_from_coords(lat: float, lon: float) -> Optional[Dict[str, Any]]:
    """
    Coord-based version — uses WorldPop TIF if rasterio is installed.
    Returns None if TIF is unavailable (falls back to estimate_consumer_base).
    """
    try:
        from app.engines.worldpop_reader import get_population_in_radius
        pop_5km  = get_population_in_radius(lat, lon, 5.0)
        pop_10km = get_population_in_radius(lat, lon, 10.0)
        if pop_5km is not None and pop_5km > 0:
            return {
                "local_consumer_base_5km":  pop_5km,
                "local_consumer_base_10km": pop_10km or pop_5km * 3,
                "model_density":             round(pop_5km / (math.pi * 25)),
                "gravity_multiplier":        1.0,
                "data_source":               "WorldPop 2025 grid (real satellite data)",
                "confidence":                "Medium",
            }
    except Exception as e:
        logger.warning(f"WorldPop TIF unavailable: {e}")
    return None
