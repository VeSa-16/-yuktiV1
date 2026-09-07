from typing import Optional
from app.services.data_service import data_service

class DataRetrieval:
    def get_demographics(self, location_id: str) -> dict:
        data = data_service.get_dataset("market_metrics")
        # Demographics mapping: find population, households, income
        pop_metric = next((m for m in data if m.get("location_id") == location_id and m.get("metric_name") == "population"), None)
        hh_metric = next((m for m in data if m.get("location_id") == location_id and m.get("metric_name") == "households"), None)
        income_metric = next((m for m in data if m.get("location_id") == location_id and m.get("metric_name") == "avg_monthly_income"), None)
        
        if not pop_metric:
            prov = data_service.get_provenance_for_dataset("market_metrics", "low")
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": prov.source_type,
                "note": "No demographic data available for this location.",
            }
            
        prov = data_service.get_provenance_for_dataset("market_metrics", pop_metric.get("confidence", "Medium"))
        return {
            "value": {
                "population": pop_metric.get("value"),
                "households": hh_metric.get("value") if hh_metric else None,
                "avg_monthly_income": income_metric.get("value") if income_metric else None,
                "data_origin": prov.source_type,
                "notes": pop_metric.get("transformation_note", "")
            },
            "confidence": prov.confidence,
            "data_origin": prov.source_type,
            "note": pop_metric.get("transformation_note", ""),
        }

    def get_competitors(self, location_id: str, category_id: str) -> dict:
        data = data_service.get_dataset("competitors")
        records = [c for c in data if c.get("location_id") == location_id and c.get("category_id") == category_id]
        
        if not records:
            prov = data_service.get_provenance_for_dataset("competitors", "low")
            return {
                "records": [],
                "count": 0,
                "confidence": "Low",
                "data_origin": prov.source_type,
                "note": "No competitor data available for this location.",
            }
            
        prov = data_service.get_provenance_for_dataset("competitors", "medium")
        return {
            "records": records,
            "count": len(records),
            "confidence": prov.confidence,
            "data_origin": prov.source_type,
            "note": f"{len(records)} competitor(s) found in verified datasets.",
        }

    def get_pricing(self, location_id: str, category_id: str) -> dict:
        data = data_service.get_dataset("prices")
        records = [p for p in data if p.get("location_id") == location_id and p.get("category_id") == category_id]
        
        if not records:
            prov = data_service.get_provenance_for_dataset("prices", "low")
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": prov.source_type,
                "note": "No pricing data available for this location.",
            }
            
        val = records[0]
        prov = data_service.get_provenance_for_dataset("prices", val.get("confidence", "High"))
        return {
            "value": {"low": val.get("value") * 0.9, "high": val.get("value") * 1.1, "unit": val.get("unit", "")}, # Estimate band
            "confidence": prov.confidence,
            "data_origin": prov.source_type,
            "note": val.get("transformation_note", ""),
        }

    def get_cost_profile(self, location_id: str, category_id: str) -> dict:
        data = data_service.get_dataset("cost_models")
        # Currently cost models don't always have location_id if they are universal, check generic first
        records = [c for c in data if c.get("category_id") == category_id and (c.get("location_id") == location_id or not c.get("location_id"))]
        
        if not records:
            prov = data_service.get_provenance_for_dataset("cost_models", "low")
            return {
                "value": None,
                "confidence": "Low",
                "data_origin": prov.source_type,
                "note": "No cost profile data available for this location.",
            }
            
        prof = records[0]
        prov = data_service.get_provenance_for_dataset("cost_models", prof.get("confidence", "Medium"))
        return {
            "value": {
                "fixed_cost_monthly": prof.get("fixed_cost_monthly"),
                "variable_cost_per_unit": prof.get("variable_cost_per_unit"),
                "selling_price_per_unit": prof.get("selling_price_per_unit"),
                "estimated_monthly_revenue": prof.get("estimated_monthly_revenue"),
                "estimated_monthly_units": prof.get("estimated_monthly_units"),
            },
            "confidence": prov.confidence,
            "data_origin": prov.source_type,
            "note": prof.get("assumption_note", ""),
        }

    def get_all_category_ids(self, location_id: str) -> list[str]:
        data = data_service.get_dataset("cost_models")
        return list(set([c.get("category_id") for c in data if c.get("category_id")]))

    def get_schemes(self) -> list[dict]:
        return data_service.get_dataset("schemes")

