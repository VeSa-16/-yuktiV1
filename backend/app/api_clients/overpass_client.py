import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

CATEGORY_OSM_MAP = {
    "retail_shop": [('shop', 'supermarket'), ('shop', 'convenience'), ('shop', 'general')],
    "retail_kirana": [('shop', 'supermarket'), ('shop', 'convenience'), ('shop', 'general')],
    "manufacturing": [('man_made', 'works')],
    "agri_business": [('shop', 'farm'), ('shop', 'agrochemical')],
    "services_tech": [('office', 'it'), ('office', 'company')],
    "food_beverage": [('amenity', 'restaurant'), ('amenity', 'cafe'), ('shop', 'bakery')],
    "handicrafts_artisanal": [('craft', 'handicraft'), ('shop', 'craft')],
    "logistics_delivery": [('office', 'logistics')],
    "education_training": [('amenity', 'school'), ('amenity', 'college')],
    "healthcare_wellness": [('amenity', 'clinic'), ('amenity', 'pharmacy'), ('amenity', 'hospital')],
    "fashion_apparel": [('shop', 'clothes'), ('shop', 'tailor')],
    "dairy": [('shop', 'dairy'), ('shop', 'cheese')],
    "poultry": [('shop', 'farm')],
    "tailoring": [('shop', 'tailor'), ('craft', 'tailor')],
    "flour_mill": [('craft', 'mill'), ('craft', 'grinding_mill')]
}

class OverpassClient:
    def get_competitors_in_radius(self, lat: float, lon: float, category_id: str, radius_meters: int = 5000) -> list:
        # A synchronous shim for the data retrieval fallback
        return []

async def query_competitors(lat: float, lon: float, radius_km: float, category_id: str) -> Optional[int]:
    """
    Queries Overpass API to find the number of competitors within a given radius.
    Returns None if the request fails or times out.
    """
    tags = CATEGORY_OSM_MAP.get(category_id, [('shop', 'yes')]) # fallback to general shop
    radius_m = int(radius_km * 1000)
    
    query_lines = []
    for k, v in tags:
        query_lines.append(f'node["{k}"="{v}"](around:{radius_m},{lat},{lon});')
        query_lines.append(f'way["{k}"="{v}"](around:{radius_m},{lat},{lon});')
    
    query_body = "\n  ".join(query_lines)
    
    overpass_query = f"""
    [out:json][timeout:5];
    (
      {query_body}
    );
    out count;
    """
    
    url = "https://overpass-api.de/api/interpreter"
    
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(url, data=overpass_query)
            response.raise_for_status()
            data = response.json()
            
            total_count = 0
            if "elements" in data:
                for element in data["elements"]:
                    if element.get("type") == "count":
                        counts = element.get("tags", {})
                        total_count += int(counts.get("nodes", 0))
                        total_count += int(counts.get("ways", 0))
            return total_count
    except Exception as e:
        logger.error(f"Overpass API query failed: {e}")
        return None
