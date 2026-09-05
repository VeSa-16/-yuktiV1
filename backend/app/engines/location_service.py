"""
Location Service — resolves user input to a known demo location.
For the prototype, this is a simple string match against seeded locations.
In production, this would integrate geocoding + admin-boundary matching.
"""
from typing import Optional


# Known demo location keywords → location_id
LOCATION_KEYWORDS = {
    "solapur": "solapur",
    "barshi": "solapur",
    "maharashtra": "solapur",  # fallback to rich-data location
    "remote": "sparse_location",
    "sparse": "sparse_location",
}


def resolve_location(input_text: str) -> Optional[str]:
    """
    Match user's location input to a known location_id.
    Returns the location_id string, or None if no match.
    """
    normalized = input_text.strip().lower()
    for keyword, loc_id in LOCATION_KEYWORDS.items():
        if keyword in normalized:
            return loc_id
    # Default to Solapur for the demo — a real system would return None
    return "solapur"


def get_location_metadata(location_id: str) -> dict:
    """Return static metadata for known demo locations."""
    METADATA = {
        "solapur": {
            "id": "solapur",
            "district": "Solapur",
            "state": "Maharashtra",
            "lat": 18.2334,
            "lng": 75.6910,
            "radius_km": 10,
            "data_richness": "rich",
        },
        "sparse_location": {
            "id": "sparse_location",
            "district": "Remote District",
            "state": "Maharashtra",
            "lat": 19.0,
            "lng": 76.0,
            "radius_km": 10,
            "data_richness": "sparse",
        },
    }
    return METADATA.get(location_id, {})
