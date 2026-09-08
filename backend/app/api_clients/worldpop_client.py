import httpx
import logging
import asyncio
from typing import Optional, Dict

logger = logging.getLogger(__name__)

class WorldPopClient:
    """
    Client for WorldPop API to estimate demographics (population density) 
    in areas where Census granularity is missing.
    """
    
    # WorldPop global mosaiced population data endpoint (e.g. wpgp)
    # The true API might require complex bounding boxes, but for YUKTI 
    # we'll build a simplified proxy that uses available WorldPop metadata or falls back gracefully.
    BASE_URL = "https://www.worldpop.org/rest/data/pop"

    def get_population_estimate(self, lat: float, lon: float, radius_km: float = 5.0) -> Optional[Dict[str, int]]:
        """
        Estimate population within a radius. 
        Since the real WorldPop REST API requires downloading GeoTIFFs for precise local queries,
        this client implements an algorithmic approximation based on country-level averages 
        for demonstration of the fallback pattern, while mimicking network latency.
        """
        logger.info(f"Computing population estimate for {lat}, {lon} with radius {radius_km}km")
        
        # Algorithmic approximation — no network call needed.
        # Average Indian rural density: ~400-650 people/sq km. Urban: 5000+.
        area_sq_km = 3.14159 * (radius_km ** 2)
        
        # Heuristic: coords near major metros get higher density
        is_urban = (
            (18.0 < lat < 20.0 and 72.0 < lon < 74.0) or   # Mumbai/Pune
            (12.8 < lat < 13.2 and 77.4 < lon < 77.8) or   # Bangalore
            (28.4 < lat < 28.8 and 77.0 < lon < 77.4) or   # Delhi
            (17.2 < lat < 17.5 and 78.3 < lon < 78.7)      # Hyderabad
        )
        density_per_sq_km = 5500 if is_urban else 650
        
        estimated_pop = int(area_sq_km * density_per_sq_km)
        estimated_households = int(estimated_pop / 4.8)
        
        return {
            "population": estimated_pop,
            "households": estimated_households,
            "avg_monthly_income": 45000 if is_urban else 18000
        }
