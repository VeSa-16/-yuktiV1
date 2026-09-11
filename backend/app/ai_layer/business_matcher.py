import logging
from typing import Dict, Any
from app.ai.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

# The allowed categories from the solapur dataset
ALLOWED_CATEGORIES = [
    "retail_shop",
    "manufacturing",
    "agri_business",
    "services_tech",
    "food_beverage",
    "handicrafts_artisanal",
    "logistics_delivery",
    "education_training",
    "healthcare_wellness",
    "fashion_apparel"
]

# Deterministic mapping for explicit frontend options
CATEGORY_MAP = {
    "Retail & Shop": "retail_shop",
    "Manufacturing": "manufacturing",
    "Agri-Business": "agri_business",
    "Services & Tech": "services_tech",
    "Food & Beverage": "food_beverage",
    "Handicrafts & Artisanal": "handicrafts_artisanal",
    "Logistics & Delivery": "logistics_delivery",
    "Education & Training": "education_training",
    "Healthcare & Wellness": "healthcare_wellness",
    "Fashion & Apparel": "fashion_apparel"
}

async def match_business_category(
    area_of_interest: str,
    suggested_idea: str,
    detailed_idea: str,
    experience: str
) -> Dict[str, Any]:
    """
    Uses Gemini to classify unstructured business ideas into a standard category.
    If the user explicitly selected a known area of interest, it deterministically
    locks in the top-level category and only asks Gemini for subcategory and reasoning.
    """
    gemini = GeminiClient()
    
    # Deterministic check
    explicit_category = CATEGORY_MAP.get(area_of_interest)
    
    if explicit_category:
        prompt = f"""
        You are a business categorization expert for YUKTI (a business intelligence platform).
        The user has provided the following inputs for their new business idea:
        - Area of Interest: {area_of_interest} (Deterministic Category: {explicit_category})
        - Suggested Idea Template: {suggested_idea}
        - Detailed Idea Description: {detailed_idea}
        - Prior Experience: {experience}

        The top-level category is ALREADY DETERMINED as '{explicit_category}'.
        Do NOT change it.
        
        Determine a 'subcategory' based on the user's detailed description (e.g., 'grocery', 'tailoring', 'dairy').
        Provide a 1-sentence explanation of how this idea fits the category.
        Return a strict JSON object with this schema, and nothing else.
        """
    else:
        prompt = f"""
        You are a business categorization expert for YUKTI (a business intelligence platform).
        The user has provided the following inputs for their new business idea:
        - Area of Interest: {area_of_interest}
        - Suggested Idea Template: {suggested_idea}
        - Detailed Idea Description: {detailed_idea}
        - Prior Experience: {experience}

        You must map this idea to ONE of the following EXACT allowed category IDs:
        {', '.join(ALLOWED_CATEGORIES)}

        Also determine a 'subcategory' based on the user's detailed description.
        Return a strict JSON object with this schema, and nothing else.
        """
    
    schema = {
        "type": "OBJECT",
        "properties": {
            "matched_category_id": {
                "type": "STRING",
                "description": "The exact category ID from the allowed list."
            },
            "matched_subcategory": {
                "type": "STRING",
                "description": "A short subcategory name (e.g. 'grocery', 'electronics')."
            },
            "confidence": {
                "type": "NUMBER",
                "description": "A float between 0.0 and 1.0 indicating confidence."
            },
            "reason": {
                "type": "STRING",
                "description": "A 1-sentence explanation of why this category was chosen."
            }
        },
        "required": ["matched_category_id", "matched_subcategory", "confidence", "reason"]
    }
    
    result = await gemini.generate_json_async(prompt, schema=schema)
    
    if result:
        # Enforce the deterministic category if it was set
        if explicit_category:
            result["matched_category_id"] = explicit_category
            
        # Fallback validation
        if result.get("matched_category_id") not in ALLOWED_CATEGORIES:
            logger.warning(f"Gemini hallucinated category: {result.get('matched_category_id')}")
            result["matched_category_id"] = explicit_category or ALLOWED_CATEGORIES[0]
            
        return result
        
    return {
        "matched_category_id": explicit_category or "retail_shop",
        "matched_subcategory": "general",
        "confidence": 0.5,
        "reason": "Fallback categorization due to AI parsing failure."
    }
