import json
from pathlib import Path
from typing import Optional
from app.services.data_service import data_service
from app.api_clients import (
    CensusClient, 
    WorldPopClient, 
    OverpassClient, 
    AgmarknetClient
)

class DataRetrieval:
    def __init__(self):
        self.census = CensusClient()
        self.worldpop = WorldPopClient()
        self.overpass = OverpassClient()
        self.agmarknet = AgmarknetClient()
        
        # Load local combined data
        processed_path = Path(__file__).resolve().parent.parent.parent / "data" / "processed" / "solapur_combined.json"
        if processed_path.exists():
            with open(processed_path, 'r', encoding='utf-8') as f:
                self.local_data = json.load(f)
        else:
            self.local_data = {"categories": {}}

    def get_category_data(self, location_id: str, category_id: str) -> dict:
        # Strict enforcement: we only have detailed data for Solapur currently.
        if not location_id or "solapur" not in location_id.lower() and "mh_sol" not in location_id.lower():
            return {}
        return self.local_data.get("categories", {}).get(category_id, {})
        
    def get_market_data(self, location_id: str, category_id: str) -> dict:
        cat_data = self.get_category_data(location_id, category_id)
        if cat_data and "competitor_market_data" in cat_data:
            return cat_data["competitor_market_data"]
        return {}

    def get_financial_data(self, location_id: str, category_id: str) -> dict:
        cat_data = self.get_category_data(location_id, category_id)
        if not cat_data:
            return {}
        return {
            "pricing_margins": cat_data.get("pricing_margins", {}),
            "initial_setup_costs": cat_data.get("initial_setup_costs", {}),
            "monthly_running_costs": cat_data.get("monthly_running_costs", {}),
            "unit_economics": cat_data.get("unit_economics", {})
        }
        
    def get_all_categories(self) -> list[str]:
        return list(self.local_data.get("categories", {}).keys())

    def _parse_location(self, location_id: str):
        try:
            if "," in location_id:
                lat, lon = location_id.split(",")
                return float(lat), float(lon)
        except:
            pass
        return 18.5204, 73.8567 # Default to Pune for safety

    def get_demographics(self, location_id: str) -> dict:
        lat, lon = self._parse_location(location_id)
        
        # Try Census API first
        demo = self.census.get_demographics(lat, lon)
        if demo:
            return {
                "value": demo,
                "confidence": "High",
                "data_origin": "Census India API",
                "note": "Official census demographics."
            }
            
        # Fallback to WorldPop spatial estimation
        demo = self.worldpop.get_population_estimate(lat, lon)
        if demo:
            return {
                "value": demo,
                "confidence": "Medium",
                "data_origin": "WorldPop Spatial API",
                "note": "Demographics estimated via spatial population grids."
            }
            
        return {
            "value": None,
            "confidence": "Low",
            "data_origin": "Unknown",
            "note": "Could not retrieve demographic data."
        }

    def get_competitors(self, location_id: str, category_id: str) -> dict:
        lat, lon = self._parse_location(location_id)
        
        records = self.overpass.get_competitors_in_radius(lat, lon, category_id, radius_meters=5000)
        
        return {
            "records": records,
            "count": len(records),
            "confidence": "High" if records else "Medium",
            "data_origin": "OpenStreetMap Overpass API",
            "note": f"{len(records)} live competitors found in area."
        }

    async def get_prices_async(self, location_id: str, category_id: str) -> dict:
        # Assuming state is passed or we resolve it, we'll hardcode 'Maharashtra' for now 
        # since Agmarknet needs a state string.
        prices = await self.agmarknet.get_prices_async("Maharashtra", category_id)
        
        return {
            "value": prices,
            "confidence": "Medium",
            "data_origin": "AGMARKNET / Estimations",
            "note": "Commodity pricing fetched."
        }

    def get_cost_profile(self, location_id: str, category_id: str) -> dict:
        return {
            "value": None,
            "confidence": "Low",
            "data_origin": "Unknown",
            "note": "AI Estimation disabled for fallback values to prevent fake data."
        }

    def get_all_category_ids(self, location_id: str) -> list[str]:
        data = data_service.get_dataset("cost_models")
        return list(set([c.get("category_id") for c in data if c.get("category_id")]))

    def get_schemes(self) -> list[dict]:
        return data_service.get_dataset("schemes")
