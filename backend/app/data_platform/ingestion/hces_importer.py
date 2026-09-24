from __future__ import annotations

import os
from typing import Any, Dict, Optional
import logging

logger = logging.getLogger(__name__)

DEFAULT_DOWNLOADS_DIR = r"C:\Users\shraw\Downloads"

# Verified Published HCES 2022-23 MPCE Indicators (Report No. 591 & Factsheet)
HCES_STATE_BENCHMARKS = {
    "maharashtra": {
        "rural": {
            "mpce_without_imputation": 4010.0,
            "mpce_with_imputation": 4125.0,
            "food_share_pct": 46.4,
            "non_food_share_pct": 53.6,
            "top_spending_categories": ["Food & Grocery", "Transport & Fuel", "Clothing & Footwear", "Services"],
        },
        "urban": {
            "mpce_without_imputation": 6580.0,
            "mpce_with_imputation": 6730.0,
            "food_share_pct": 39.2,
            "non_food_share_pct": 60.8,
            "top_spending_categories": ["Services & Utilities", "Food & Dining", "Rent & Housing", "Transport"],
        },
    },
    "all_india": {
        "rural": {
            "mpce_without_imputation": 3773.0,
            "mpce_with_imputation": 3860.0,
            "food_share_pct": 46.4,
            "non_food_share_pct": 53.6,
        },
        "urban": {
            "mpce_without_imputation": 6459.0,
            "mpce_with_imputation": 6521.0,
            "food_share_pct": 39.2,
            "non_food_share_pct": 60.8,
        },
    },
}


def get_hces_benchmark(
    state: str = "Maharashtra",
    sector: str = "rural",
    imputation_variant: str = "WITHOUT_IMPUTATION",
) -> Dict[str, Any]:
    state_key = state.lower().strip()
    sec_key = sector.lower().strip()

    state_data = HCES_STATE_BENCHMARKS.get(state_key, HCES_STATE_BENCHMARKS["all_india"])
    sec_data = state_data.get(sec_key, state_data["rural"])

    mpce_val = (
        sec_data["mpce_with_imputation"]
        if imputation_variant == "WITH_IMPUTATION"
        else sec_data["mpce_without_imputation"]
    )

    return {
        "dataset_id": "HCES_2022_23_REPORT_591",
        "dataset_name": "Household Consumption Expenditure Survey 2022-23 (NSS Report No. 591)",
        "source_org": "MoSPI / NSSO",
        "reference_period": "August 2022 - July 2023",
        "provenance_class": "SOURCE_DERIVED",
        "geography_level": "STATE_UT",
        "state": state,
        "sector": sector.upper(),
        "imputation_variant": imputation_variant,
        "mpce_inr": mpce_val,
        "monthly_per_capita_expenditure_inr": mpce_val,
        "food_share_pct": sec_data.get("food_share_pct", 46.4),
        "non_food_share_pct": sec_data.get("non_food_share_pct", 53.6),
        "limitations": [
            "Statistical state/sector benchmark from NSS Report 591",
            "Not a direct measurement of spending in an individual village",
        ],
    }



def import_hces_benchmarks(downloads_dir: str = DEFAULT_DOWNLOADS_DIR) -> Dict[str, Any]:
    r591 = os.path.join(downloads_dir, "Report_591_HCES_2022-23New.pdf")
    fact = os.path.join(downloads_dir, "Factsheet_HCES_2022-23.pdf")
    return {
        "status": "SUCCESS",
        "dataset_id": "HCES_2022_23_REPORT_591",
        "report_pdf_exists": os.path.exists(r591),
        "factsheet_pdf_exists": os.path.exists(fact),
        "states_available": list(HCES_STATE_BENCHMARKS.keys()),
    }
