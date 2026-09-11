import logging
from typing import Dict, Any, Optional
from app.ai.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

# Initialize client; defaults to GEMINI_API_KEY from environment
gemini = GeminiClient()

_ONBOARDING_SYSTEM_PROMPT = """
You are an expert intent parser for an AI-Driven Business Advisory platform called YuktiFi.
The user is a rural micro-entrepreneur describing their business idea.
Extract the following structured information from their text:
1. `business_category`: The general category of the business (e.g., "dairy", "retail", "textiles", "food processing", "agriculture"). Normalize to lowercase. If unclear, return null.
2. `location`: The name of the village, town, city, or district mentioned. If none, return null.
3. `capital_in_inr`: The total investment capital mentioned, parsed as an integer in Indian Rupees (INR). E.g., "1 lakh" -> 100000, "50k" -> 50000. If none, return null.
4. `experience_level`: A brief string describing their prior experience if mentioned (e.g., "5 years", "none", "beginner"). If none, return null.

Return ONLY a valid JSON object matching this schema. Do not include markdown formatting or extra text.
"""

_ONBOARDING_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "business_category": {"type": "STRING", "nullable": True},
        "location": {"type": "STRING", "nullable": True},
        "capital_in_inr": {"type": "INTEGER", "nullable": True},
        "experience_level": {"type": "STRING", "nullable": True}
    },
    "required": ["business_category", "location", "capital_in_inr", "experience_level"]
}

async def parse_onboarding_text(text: str) -> Dict[str, Any]:
    """
    Parses free-form natural language text to extract business onboarding details.
    Uses the asynchronous Gemini client.
    """
    prompt = f"{_ONBOARDING_SYSTEM_PROMPT}\n\nUser Text:\n{text}"
    
    try:
        result = await gemini.generate_json_async(prompt, schema=_ONBOARDING_SCHEMA)
        if result:
            return result
    except Exception as e:
        logger.error(f"Error parsing onboarding text: {e}")
        
    # Fallback to nulls if parsing fails
    return {
        "business_category": None,
        "location": None,
        "capital_in_inr": None,
        "experience_level": None
    }
