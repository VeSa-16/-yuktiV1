"""
Data Retrieval Layer — Section 9/26.
Provides structured access to curated datasets with confidence tagging.
Every method returns data + confidence + source provenance.
"""
import json
from pathlib import Path
from typing import Optional
from app.data_layer.confidence_tagging import tag_confidence

DATASETS_DIR = Path(__file__).parent / "datasets"

# Location ID → dataset directory mapping
LOCATION_MAP = {
    "solapur": "location_1_solapur",
    "sparse_location": "location_2_sparse",
}


def _load_json(location_key: str, filename: str) -> Optional[dict]:
    folder = LOCATION_MAP.get(location_key)
    if not folder:
        return None
    path = DATASETS_DIR / folder / filename
    if not path.exists():
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _load_schemes() -> list:
    path = DATASETS_DIR / "schemes" / "nsfdc_schemes.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


class DataRetrieval:
    """Unified interface for retrieving structured data with provenance."""

    def get_demographics(self, location_id: str) -> dict:
        data = _load_json(location_id, "demographics.json")
        if data is None or data.get("population") is None:
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": "No demographic data available for this location.",
            }
        return {
            "value": data,
            "confidence": tag_confidence(data.get("data_origin", "prototype_curated"),
                                         1 if data.get("population") else 0),
            "data_origin": data.get("data_origin", "prototype_curated"),
            "note": data.get("notes", ""),
        }

    def get_competitors(self, location_id: str, category_id: str) -> dict:
        data = _load_json(location_id, "competitors.json")
        if data is None:
            return {
                "records": [],
                "count": 0,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": "No competitor data available for this location.",
            }
        cats = data.get("categories", {})
        records = cats.get(category_id, [])
        if not records:
            return {
                "records": [],
                "count": 0,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": f"No competitor data available for '{category_id}' in this location.",
            }
        origins = {r.get("data_origin", "prototype_curated") for r in records}
        confidence = tag_confidence(
            "public_source" if "public_source" in origins else "prototype_curated",
            len(records)
        )
        return {
            "records": records,
            "count": len(records),
            "confidence": confidence,
            "data_origin": list(origins)[0] if len(origins) == 1 else "mixed",
            "note": f"{len(records)} competitor(s) found within 10km radius.",
        }

    def get_pricing(self, location_id: str, category_id: str) -> dict:
        data = _load_json(location_id, "pricing.json")
        if data is None:
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": "No pricing data available for this location.",
            }
        cats = data.get("categories", {})
        band = cats.get(category_id)
        if band is None:
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": f"No pricing data for '{category_id}' in this location.",
            }
        return {
            "value": {"low": band["low"], "high": band["high"], "unit": band.get("unit", "")},
            "confidence": band.get("confidence", "Medium"),
            "data_origin": band.get("data_origin", "prototype_curated"),
            "note": band.get("source", ""),
        }

    def get_cost_profile(self, location_id: str, category_id: str) -> dict:
        data = _load_json(location_id, "cost_profiles.json")
        if data is None:
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": "No cost profile data available for this location.",
            }
        cats = data.get("categories", {})
        profile = cats.get(category_id)
        if profile is None:
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": "unavailable",
                "note": f"No cost profile for '{category_id}' in this location.",
            }
        return {
            "value": {
                "fixed_cost_monthly": profile["fixed_cost_monthly"],
                "variable_cost_per_unit": profile["variable_cost_per_unit"],
                "selling_price_per_unit": profile["selling_price_per_unit"],
                "estimated_monthly_revenue": profile["estimated_monthly_revenue"],
                "estimated_monthly_units": profile.get("estimated_monthly_units"),
            },
            "confidence": tag_confidence(profile.get("data_origin", "prototype_curated"), 1),
            "data_origin": profile.get("data_origin", "prototype_curated"),
            "note": profile.get("note", ""),
        }

    def get_all_category_ids(self, location_id: str) -> list[str]:
        """Return list of categories that have cost profiles in this location."""
        data = _load_json(location_id, "cost_profiles.json")
        if data is None:
            return []
        return list(data.get("categories", {}).keys())

    def get_schemes(self) -> list[dict]:
        return _load_schemes()
