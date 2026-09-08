import httpx
import logging
from typing import Optional, Dict
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class AgmarknetClient:
    """
    Client for fetching daily commodity prices from data.gov.in / AGMARKNET.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        # Example API endpoint for data.gov.in AGMARKNET dataset
        self.BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        
    async def get_prices_async(self, state: str, commodity: str) -> Optional[Dict[str, float]]:
        """
        Fetches the min, max, and modal prices for a given commodity in a state.
        """
        if not self.api_key:
            logger.warning("No data.gov.in API key provided. Falling back to estimated regional bands.")
            return await self._fallback_pricing_async(commodity)
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.BASE_URL,
                    params={
                        "api-key": self.api_key,
                        "format": "json",
                        "filters[state]": state.title(),
                        "filters[commodity]": commodity.title(),
                        "limit": 10
                    },
                    timeout=5.0
                )
                response.raise_for_status()
                data = response.json()
                
                records = data.get("records", [])
                if not records:
                    return await self._fallback_pricing_async(commodity)
                    
                avg_modal = sum(float(r.get("modal_price", 0)) for r in records) / len(records)
                
                return {
                    "low": avg_modal * 0.9,
                    "high": avg_modal * 1.1,
                    "unit": "Quintal"
                }
                
        except Exception as e:
            logger.error(f"AGMARKNET API error: {e}")
            return await self._fallback_pricing_async(commodity)
            
    async def _fallback_pricing_async(self, commodity: str) -> Dict[str, float]:
        """Provides heuristic pricing via Gemini AI if API fails or key is missing."""
        from app.api_clients.gemini_client import GeminiClient
        client = GeminiClient()
        
        prompt = f"""
        Estimate realistic live wholesale commodity prices in India for '{commodity}'.
        Output ONLY a JSON object exactly matching this schema, with no other text.
        Schema:
        {{
            "low": float (lowest expected price),
            "high": float (highest expected price),
            "unit": string (e.g. 'Quintal', 'Liter', 'Kg')
        }}
        """
        
        result = await client.generate_json_async(prompt)
        if result and "low" in result and "high" in result and "unit" in result:
            return result
            
        # Hard fallback if Gemini fails
        bases = {
            "Wheat": 2200,
            "Rice": 3500,
            "Milk": 55, 
            "Poultry": 120, 
            "Tailoring": 400, 
        }
        base_price = bases.get(commodity.title(), 1000)
        unit = "Liter" if commodity.title() == "Milk" else "Kg" if commodity.title() == "Poultry" else "Unit"
        
        return {
            "low": base_price * 0.85,
            "high": base_price * 1.15,
            "unit": unit
        }

