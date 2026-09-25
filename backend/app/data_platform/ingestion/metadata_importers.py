"""
YUKTI Data Platform - Metadata Importers.
Handles reference standard & schedule metadata ingestion for:
1. Bhuvan Geospatial Standards 2015 (BHUVAN_GEOSPATIAL_STANDARDS_2015)
2. Labour Bureau Wage Rates in Rural India Release Calendar (LABOUR_BUREAU_RELEASE_CALENDAR)
"""

import os
import hashlib
from typing import Dict, Any

RAW_DATA_DIR = r"C:\Users\Vedant\Desktop\sih"

BHUVAN_FILE = os.path.join(RAW_DATA_DIR, "4_Bhuvan_Data_Content_And_Map_Standards.pdf")
LABOUR_FILE = os.path.join(RAW_DATA_DIR, "WRIpdf-517a7d2e45e78b3958e752dcd189e6b8.pdf")


def calculate_sha256(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def import_bhuvan_metadata(file_path: str = None) -> Dict[str, Any]:
    """
    Registers Bhuvan GIS Data Content & Map Standards (2015) as a metadata/governance reference.
    Ensures dataset classification is REFERENCE_DOCUMENT / REFERENCE_STANDARD.
    """
    target_path = file_path or BHUVAN_FILE
    checksum = calculate_sha256(target_path)

    metadata = {
        "dataset_id": "BHUVAN_GEOSPATIAL_STANDARDS_2015",
        "title": "Bhuvan Data Content and Map Standards",
        "publisher": "National Remote Sensing Centre (NRSC) / ISRO",
        "publication_year": 2015,
        "classification": "REFERENCE_STANDARD",
        "file_path": target_path,
        "checksum": checksum,
        "usable_as_data": False,
        "standards": {
            "spatial_datum": "WGS84",
            "projection": "LCC (Lambert Conformal Conic) / UTMS",
            "recommended_scale": "1:10,000 to 1:50,000",
            "planimetric_accuracy": "12.5 meters for 1:50k, 2.5 meters for 1:10k",
            "minimum_mappable_unit": "0.1 ha for high resolution",
            "thematic_accuracy_target": "85% minimum confidence",
        },
        "status": "REGISTERED",
    }
    return metadata


def import_labour_calendar(file_path: str = None) -> Dict[str, Any]:
    """
    Registers Labour Bureau Calendar of Events for Wage Rates in Rural India (WRI).
    CRITICAL: Classified strictly as SCHEDULE_METADATA, NOT wage rate observations.
    """
    target_path = file_path or LABOUR_FILE
    checksum = calculate_sha256(target_path)

    metadata = {
        "dataset_id": "LABOUR_BUREAU_RELEASE_CALENDAR",
        "title": "Labour Bureau WRI Release Calendar & Events",
        "publisher": "Labour Bureau, Ministry of Labour & Employment, Govt of India",
        "classification": "SCHEDULE_METADATA",
        "file_path": target_path,
        "checksum": checksum,
        "usable_as_data": False,
        "note": "Document contains release schedule calendar for Rural Wage Rates. It does NOT contain wage observations.",
        "schedule": {
            "frequency": "MONTHLY",
            "coverage": "20 States (Rural Wage Rates for 25 Agricultural & Non-Agricultural Occupations)",
            "expected_lag": "Approx 30-45 days post reference month",
        },
        "status": "REGISTERED",
    }
    return metadata
