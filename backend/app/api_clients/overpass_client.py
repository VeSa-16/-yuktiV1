import httpx
import logging
import math
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Map YuktiFi category_ids to Overpass specific key-value pairs
CATEGORY_TAG_MAP = {
    "retail_kirana": '["shop"="convenience"]',
    "dairy": '["shop"="dairy"]',
    "tailoring": '["craft"="tailor"]',
    "flour_mill": '["craft"="mill"]',
    "poultry": '["landuse"="farm"]["farm"="poultry"]', # Example proxy
}

class OverpassClient:
    """
    Client for OpenStreetMap's Overpass API.
    Fetches actual shops and competitors within a radius.
    """
    BASE_URL = "https://overpass-api.de/api/interpreter"

    def get_competitors_in_radius(self, lat: float, lon: float, category_id: str, radius_meters: int = 5000) -> List[Dict[str, Any]]:
        """
        Finds POIs matching the category within `radius_meters` of (lat, lon).
        Returns a list of competitor records with distance calculations.
        """
        tags = CATEGORY_TAG_MAP.get(category_id, '["shop"]')
        
        # Overpass QL query: Find nodes/ways/rels with specific tags within radius
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
            with httpx.Client(headers={"User-Agent": "YuktiFi/1.0 (market intelligence; contact@yukti.in)"}) as client:
                response = client.post(self.BASE_URL, data={"data": query}, timeout=5.0)
                response.raise_for_status()
                data = response.json()
                
                elements = data.get("elements", [])
                competitors = []
                
                for el in elements:
                    # 'center' for ways/relations, 'lat'/'lon' for nodes
                    el_lat = el.get("lat") or el.get("center", {}).get("lat")
                    el_lon = el.get("lon") or el.get("center", {}).get("lon")
                    tags = el.get("tags", {})
                    
                    if not el_lat or not el_lon:
                        continue
                        
                    # Calculate rough straight-line distance in km (Haversine approximation)
                    dist_km = self._haversine(lat, lon, el_lat, el_lon)
                    
                    name = tags.get("name", tags.get("brand", "Unnamed Business"))
                    
                    competitors.append({
                        "id": str(el["id"]),
                        "name": name,
                        "type": tags.get("shop", tags.get("craft", category_id)),
                        "lat": el_lat,
                        "lon": el_lon,
                        "distance_km": round(dist_km, 2)
                    })
                    
                # Sort by closest first
                competitors.sort(key=lambda x: x["distance_km"])
                logger.info(f"Overpass API found {len(competitors)} competitors for '{category_id}' around {lat},{lon}")
                return competitors
                
        except Exception as e:
            logger.error(f"Overpass API error for '{category_id}': {e}")
            return []

    def _haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate the great circle distance in kilometers between two points on the earth."""
        R = 6371.0 # Radius of earth in kilometers
        dLat = math.radians(lat2 - lat1)
        dLon = math.radians(lon2 - lon1)
        a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
