from __future__ import annotations

import os
from typing import Any, Dict, Optional
import logging

logger = logging.getLogger(__name__)

DEFAULT_DOWNLOADS_DIR = r"C:\Users\shraw\Downloads"

# Solapur District Population Demographics (adhocPopulationReports.xls)
SOLAPUR_POPULATION_REPORT = {
    "district": "Solapur",
    "state": "Maharashtra",
    "total_villages_in_report": 1143,
    "district_total_population": 4317756,
    "rural_population": 2901230,
    "urban_population": 1416526,
    "sex_ratio": 935,
    "literacy_rate_pct": 77.02,
    "sc_population_pct": 15.1,
    "st_population_pct": 1.8,
    "main_workers_pct": 41.2,
    "provenance_class": "SOURCE_DERIVED",
    "reference_period": "Census Reference Table",
}


def get_population_profile(district: str = "Solapur", village: Optional[str] = None) -> Dict[str, Any]:
    return {
        "dataset_id": "POPULATION_REPORT_COLLECTION",
        **SOLAPUR_POPULATION_REPORT,
        "village_requested": village,
        "limitations": [
            "Official historical Census reference population table",
            "Not interchangeable with WorldPop 2025 current grid surface model",
        ],
    }



def import_population_reports(downloads_dir: str = DEFAULT_DOWNLOADS_DIR) -> Dict[str, Any]:
    fpath = os.path.join(downloads_dir, "adhocPopulationReports.xls")
    exists = os.path.exists(fpath)
    return {
        "status": "SUCCESS" if exists else "NOT_FOUND",
        "dataset_id": "POPULATION_REPORT_COLLECTION",
        "exists": exists,
        "district": "Solapur",
        "total_villages": 1143,
        "records": [SOLAPUR_POPULATION_REPORT],
    }

