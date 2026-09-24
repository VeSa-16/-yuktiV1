from datetime import datetime, timedelta

def get_insurance_recommendations(category_name: str) -> list:
    """
    Recommends government insurance schemes based on the business category.
    """
    recommendations = [
        {
            "name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
            "type": "Accidental Death & Disability",
            "premium": "₹20 / year",
            "coverage": "₹2,00,000",
            "description": "Essential protection for any entrepreneur against accidental disability or death."
        },
        {
            "name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
            "type": "Life Insurance",
            "premium": "₹436 / year",
            "coverage": "₹2,00,000",
            "description": "Term life insurance covering death due to any reason."
        }
    ]
    
    # Add specific insurance based on category
    category = str(category_name).lower()
    if "dairy" in category or "poultry" in category or "agri" in category:
        recommendations.append({
            "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY) / Livestock Insurance",
            "type": "Asset / Crop Insurance",
            "premium": "2-5% of insured value",
            "coverage": "Varies by asset",
            "description": "Protects against loss of crops or livestock due to natural calamities or disease."
        })
    elif "tailoring" in category or "mill" in category or "retail" in category:
        recommendations.append({
            "name": "Shopkeeper's Insurance Policy (General)",
            "type": "Fire & Burglary",
            "premium": "~₹1,500 / year",
            "coverage": "₹5,00,000",
            "description": "Protects your physical shop and inventory against fire, theft, and natural disasters."
        })
        
    return recommendations
