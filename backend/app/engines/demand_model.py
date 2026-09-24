import json
import logging
import math
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)

DATASET_FILE = Path(__file__).parent.parent.parent / "data" / "processed" / "solapur_combined.json"

def _load_dataset():
    try:
        with open(DATASET_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load dataset in demand model: {e}")
        return {}

DATASET = _load_dataset()

def estimate_consumer_base(village_or_taluka: str, district: str) -> Dict[str, Any]:
    """
    Computes an estimated consumer base within a 5km and 10km radius using a simplified Huff Gravity Model.
    """
    district_data = DATASET.get("district_overview", {})
    
    # Fallbacks if district data is missing
    district_pop = district_data.get("demographics", {}).get("district_population_estimated_2026", 4954000)
    district_area = district_data.get("geography", {}).get("total_area_sq_km", 14895)
    default_density = district_pop / district_area if district_area else 332
    
    # Find matching taluka
    loc_lower = (village_or_taluka or "").lower()
    talukas = district_data.get("talukas", [])
    
    matched_taluka = None
    for t in talukas:
        if t.get("name", "").lower() in loc_lower or t.get("headquarters", "").lower() in loc_lower:
            matched_taluka = t
            break
            
    # Base density
    if matched_taluka and matched_taluka.get("area_sq_km") and matched_taluka.get("population_2011_census"):
        # Add ~15% for 2011->2026 growth
        pop = matched_taluka["population_2011_census"] * 1.15
        area = matched_taluka["area_sq_km"]
        density = pop / area
    else:
        density = default_density

    # Gravity multiplier
    # If the location is a known town or HQ, it exerts gravitational pull on surrounding villages
    gravity_multiplier = 1.0
    is_hq = matched_taluka and matched_taluka.get("headquarters", "").lower() in loc_lower
    
    if "solapur" in loc_lower:
        gravity_multiplier = 4.0 # Major city
    elif is_hq or "barshi" in loc_lower or "pandharpur" in loc_lower or "akluj" in loc_lower:
        gravity_multiplier = 2.5 # Taluka HQ or major town
    else:
        gravity_multiplier = 1.2 # Standard rural village with some local gravity
        
    # Calculate areas
    area_5km = math.pi * (5 ** 2) # ~78.5 sq km
    area_10km = math.pi * (10 ** 2) # ~314 sq km
    
    # Apply model
    base_5km = round(area_5km * density * gravity_multiplier)
    base_10km = round(area_10km * density * (gravity_multiplier * 0.8)) # Gravity weakens at 10km for small towns
    
    return {
        "local_consumer_base_5km": base_5km,
        "local_consumer_base_10km": base_10km,
        "model_density": round(density),
        "gravity_multiplier": gravity_multiplier
    }
