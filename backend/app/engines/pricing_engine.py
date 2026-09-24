import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

PPI_FILE = Path(__file__).parent.parent.parent / "data" / "district_purchasing_power.json"
DEFAULT_PPI = 0.75 # Default for rural maharashtra if not found

def load_ppi_data():
    try:
        with open(PPI_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to load PPI data: {e}")
        return {}

PPI_DATA = load_ppi_data()

def compute_adjusted_pricing(base_low: float, base_high: float, location_str: str, competitor_count: int, language: str = "en") -> dict:
    """
    Deterministically computes a suggested price range based on the base band, PPI, and competitor density.
    Returns: {"suggested_price_range": "...", "price_rationale": "..."}
    """
    loc_lower = location_str.lower()
    
    # Find PPI
    ppi = DEFAULT_PPI
    matched_loc = "default"
    for loc, data in PPI_DATA.items():
        if loc in loc_lower:
            ppi = data.get("ppi", DEFAULT_PPI)
            matched_loc = loc
            break
            
    # Adjust for PPI
    ppi_adj = min(max(ppi, 0.5), 1.2) # Bound the adjustment
    adj_low = base_low * ppi_adj
    adj_high = base_high * ppi_adj
    
    # Adjust for competition (higher competition = price pressure)
    comp_adj = 1.0
    if competitor_count > 10:
        comp_adj = 0.90 # 10% pressure
    elif competitor_count > 5:
        comp_adj = 0.95 # 5% pressure
    elif competitor_count == 0:
        comp_adj = 1.05 # 5% premium
        
    final_low = round(adj_low * comp_adj)
    final_high = round(adj_high * comp_adj)
    
    # Generate deterministic rationale
    if language == "en":
        rationale = f"Adjusted {'below' if ppi_adj * comp_adj < 1.0 else 'above'} base average due to local purchasing power index ({ppi}) and competitor density ({competitor_count} nearby)."
    else:
        rationale = f"स्थानीय क्रय शक्ति सूचकांक ({ppi}) और प्रतिस्पर्धी घनत्व ({competitor_count} पास में) के कारण आधार औसत से {'नीचे' if ppi_adj * comp_adj < 1.0 else 'ऊपर'} समायोजित किया गया।"
        
    return {
        "suggested_price_range": f"₹{final_low} - ₹{final_high}",
        "price_rationale": rationale
    }
