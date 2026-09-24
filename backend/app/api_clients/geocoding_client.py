import httpx
import logging
import urllib.parse
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

async def geocode_location(location_name: str) -> Optional[Tuple[float, float]]:
    """
    Resolves a location string to (lat, lon) using the Nominatim API.
    Returns None if the geocoding fails or times out.
    """
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(location_name)}&format=json&limit=1"
    
    headers = {
        "User-Agent": "YuktiFi-SIH-Hackathon/1.0"
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                lat = float(data[0]["lat"])
                lon = float(data[0]["lon"])
                return lat, lon
            else:
                logger.warning(f"Geocoding returned no results for: {location_name}")
                return None
    except Exception as e:
        logger.error(f"Geocoding failed for {location_name}: {e}")
        return None

class GeocodingClient:
    def get_coordinates(self, location_name: str) -> Optional[Tuple[float, float]]:
        url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(location_name)}&format=json&limit=1"
        headers = {"User-Agent": "YuktiFi-SIH-Hackathon/1.0"}
        try:
            with httpx.Client(timeout=5.0) as client:
                response = client.get(url, headers=headers)
                response.raise_for_status()
                data = response.json()
                if data and len(data) > 0:
                    lat = float(data[0]["lat"])
                    lon = float(data[0]["lon"])
                    return lat, lon
        except Exception as e:
            logger.error(f"Geocoding failed for {location_name}: {e}")
        return None
