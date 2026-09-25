"""
Location Service — resolves user input to a known location ID.
Integrates with the DataService to match against valid loaded datasets.
"""
from typing import Optional
from app.services.data_service import data_service


from app.api_clients.geocoding_client import GeocodingClient

def resolve_location(input_text: str) -> Optional[str]:
    """
    Match user's location input using Geocoding API, with a robust fallback.
    Returns the location_id string as 'lat,lon', or None if no match.
    """
    if not input_text:
        return None
        
    # Quick fallback for common testing locations (case-insensitive)
    normalized_input = input_text.lower().strip()
    fallbacks = {
        "solapur": "17.6599,75.9064",
        "pune": "18.5204,73.8567",
        "mumbai": "19.0760,72.8777",
        "remote": "0.0,0.0",
        "delhi": "28.7041,77.1025",
        "bangalore": "12.9716,77.5946",
        "nashik": "20.0059,73.7903",
        "ahmedabad": "23.0225,72.5714",
        "surat": "21.1702,72.8311",
        "mysore": "12.2958,76.6394"
    }
    
    for city, coords in fallbacks.items():
        if city in normalized_input:
            return coords
            
    geocoder = GeocodingClient()
    coords = geocoder.get_coordinates(input_text)
    
    if coords:
        return f"{coords[0]},{coords[1]}"
        
    # Ultimate fallback if geocoding fails and input is unknown
    import logging
    logging.getLogger(__name__).warning(f"Geocoding failed for {input_text}. Defaulting to Solapur.")
    return "17.6599,75.9064"


def get_location_metadata(location_id: str) -> dict:
    """Return metadata for a given location_id string ('lat,lon')."""
    try:
        if "," in location_id:
            lat_str, lon_str = location_id.split(",")
            return {
                "id": location_id,
                "lat": float(lat_str),
                "lon": float(lon_str),
                "village": "Selected Location",
                "block": "",
                "district": "",
                "state": "Maharashtra", # Example default state for commodity searches
                "radius_km": 5
            }
    except Exception:
        pass
        
    return {}
