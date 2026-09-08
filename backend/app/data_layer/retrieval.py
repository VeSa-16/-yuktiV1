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
        from app.api_clients.gemini_client import GeminiClient
        client = GeminiClient()
        
        prompt = f"""
        Estimate realistic unit economics for a small business in India in the category '{category_id}'.
        Output ONLY a JSON object exactly matching this schema, with no other text.
        Schema:
        {{
            "fixed_cost_monthly": integer (e.g. rent, salaries, utilities),
            "variable_cost_per_unit": integer (e.g. raw material cost per item or service),
            "selling_price_per_unit": integer (e.g. average selling price to customer),
            "estimated_monthly_revenue": integer,
            "estimated_monthly_units": integer,
            "assumption_note": string (brief explanation of the business model assumed)
        }}
        """
        
        fallback = {
            "fixed_cost_monthly": 15000,
            "variable_cost_per_unit": 50,
            "selling_price_per_unit": 150,
            "estimated_monthly_revenue": 45000,
            "estimated_monthly_units": 300,
            "assumption_note": "Fallback estimates used due to AI timeout."
        }
        
        result = client.generate_json(prompt)
        prof = result if result else fallback
        confidence = "High" if result else "Low"

        return {
            "value": {
                "fixed_cost_monthly": prof.get("fixed_cost_monthly", fallback["fixed_cost_monthly"]),
                "variable_cost_per_unit": prof.get("variable_cost_per_unit", fallback["variable_cost_per_unit"]),
                "selling_price_per_unit": prof.get("selling_price_per_unit", fallback["selling_price_per_unit"]),
                "estimated_monthly_revenue": prof.get("estimated_monthly_revenue", fallback["estimated_monthly_revenue"]),
                "estimated_monthly_units": prof.get("estimated_monthly_units", fallback["estimated_monthly_units"]),
            },
            "confidence": confidence,
            "data_origin": "Gemini 2.5 AI Estimation",
            "note": prof.get("assumption_note", "No assumptions provided."),
        }

    def get_all_category_ids(self, location_id: str) -> list[str]:
        data = data_service.get_dataset("cost_models")
        return list(set([c.get("category_id") for c in data if c.get("category_id")]))

    def get_schemes(self) -> list[dict]:
        return data_service.get_dataset("schemes")
