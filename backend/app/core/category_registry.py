"""
Canonical Category ID Registry and Normalization.
Ensures uniform category aliases across dataset lookups, seasonal calculations,
competitor queries, cost profiles, ranking, and simulations.
"""

CATEGORY_ALIASES = {
    "retail_kirana": "retail_shop",
}


def normalize_category_id(category_id: str) -> str:
    """Returns the canonical category ID for a given alias or returns the ID as-is."""
    if not category_id:
        return "retail_shop"
    return CATEGORY_ALIASES.get(category_id, category_id)
