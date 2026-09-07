"""
Location Service — resolves user input to a known location ID.
Integrates with the DataService to match against valid loaded datasets.
"""
from typing import Optional
from app.services.data_service import data_service


def resolve_location(input_text: str) -> Optional[str]:
    """
    Match user's location input to a known location_id from the JSON database.
    Returns the location_id string, or None if no match.
    """
    if not input_text:
        return None
        
    normalized = input_text.strip().lower()
    locations = data_service.get_dataset("locations")
    
    # Simple search against village, block, district
    for loc in locations:
        if (loc.get("village", "").lower() in normalized or 
            loc.get("block", "").lower() in normalized or
            loc.get("district", "").lower() in normalized):
            return loc.get("id")
            
    # If we couldn't resolve the location, return None. We NO LONGER default to a fake location.
    return None


def get_location_metadata(location_id: str) -> dict:
    """Return metadata for a given location_id from the dataset."""
    locations = data_service.get_dataset("locations")
    for loc in locations:
        if loc.get("id") == location_id:
            # Inject radius_km for subsequent queries
            loc["radius_km"] = 10
            return loc
    return {}
