"""
Location Service — resolves user input to a known demo location.
For the prototype, this is a simple string match against seeded locations.
In production, this would integrate geocoding + admin-boundary matching.
"""
from typing import Optional


# Known demo location keywords → location_id
LOCATION_KEYWORDS = {
    "solapur": "loc_akkalkot",
    "akkalkot": "loc_akkalkot",
    "barshi": "loc_akkalkot",
    "maharashtra": "loc_akkalkot",  # fallback to rich-data location
    "karha": "loc_karha",
    "baramati": "loc_karha",
    "pune": "loc_karha",
    "remote": "loc_sparse_rural",
    "sparse": "loc_sparse_rural",
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
    return "loc_akkalkot"


def get_location_metadata(location_id: str) -> dict:
    """Return static metadata for known demo locations."""
    METADATA = {
        "loc_akkalkot": {
            "id": "loc_akkalkot",
            "district": "Solapur",
            "state": "Maharashtra",
            "lat": 17.52,
            "lng": 76.21,
            "radius_km": 10,
            "data_richness": "rich",
        },
        "loc_karha": {
            "id": "loc_karha",
            "district": "Pune",
            "state": "Maharashtra",
            "lat": 18.15,
            "lng": 74.58,
            "radius_km": 10,
            "data_richness": "sparse",
        },
        "loc_sparse_rural": {
            "id": "loc_sparse_rural",
            "district": "Remote District",
            "state": "Maharashtra",
            "lat": 19.0,
            "lng": 76.0,
            "radius_km": 10,
            "data_richness": "sparse",
        },
    }
    return METADATA.get(location_id, {})
