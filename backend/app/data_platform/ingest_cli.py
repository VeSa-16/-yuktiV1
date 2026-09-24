"""
YUKTI Data Platform - Reproducible Ingestion CLI.
Run via:
    python -m app.data_platform.ingest_cli [all | lgd | worldpop | hces | irrigation | economic | population | metadata]
"""

import sys
import os
import json
import time
from typing import Dict, Any

from app.data_platform.ingestion import (
    import_lgd_datasets,
    import_worldpop_raster,
    import_hces_benchmarks,
    import_irrigation_dataset,
    import_economic_reports,
    import_population_reports,
    import_bhuvan_metadata,
    import_labour_calendar,
)

MANIFEST_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "import_manifest.json"))


def run_ingestion(target: str = "all") -> Dict[str, Any]:
    print(f"=== Starting YUKTI Real Data Ingestion Pipeline [Target: {target}] ===")
    start_time = time.time()

    os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
    results = {}

    if target in ["all", "lgd"]:
        print("\n--> Ingesting LGD Administrative Datasets...")
        results["lgd"] = import_lgd_datasets()
        subd_count = len(results["lgd"].get("subdistricts", []))
        v_count = len(results["lgd"].get("villages", []))
        print(f"    Loaded {subd_count} sub-districts and {v_count} villages.")

    if target in ["all", "worldpop"]:
        print("\n--> Ingesting WorldPop 2025 1km Population Surface...")
        results["worldpop"] = import_worldpop_raster()
        dims = results["worldpop"].get("dimensions", {"width": 0, "height": 0})
        print(f"    Raster Dimensions: {dims['width']}x{dims['height']} cells.")

    if target in ["all", "hces"]:
        print("\n--> Ingesting HCES 2022-23 Survey Benchmarks...")
        results["hces"] = import_hces_benchmarks()
        b_count = len(results["hces"].get("states_available", []))
        print(f"    Extracted {b_count} State MPCE benchmarks from Report 591.")


    if target in ["all", "irrigation"]:
        print("\n--> Ingesting Ahilyanagar Historical Irrigation XML...")
        results["irrigation"] = import_irrigation_dataset()
        rec_count = len(results["irrigation"].get("records", []))
        print(f"    Parsed {rec_count} crop & area records.")

    if target in ["all", "economic"]:
        print("\n--> Ingesting District Economic Reports...")
        results["economic"] = import_economic_reports()
        d_count = len(results["economic"].get("districts", []))
        print(f"    Parsed enterprise profiles for {d_count} districts.")

    if target in ["all", "population"]:
        print("\n--> Ingesting Adhoc Population Reports...")
        results["population"] = import_population_reports()
        p_count = len(results["population"].get("records", []))
        print(f"    Parsed population profiles for {p_count} villages/units.")


    if target in ["all", "metadata"]:
        print("\n--> Registering Bhuvan Standards & Labour Bureau Calendar Metadata...")
        results["bhuvan"] = import_bhuvan_metadata()
        results["labour_calendar"] = import_labour_calendar()
        print("    Registered Bhuvan GIS standards and Labour Bureau release calendar.")

    elapsed = round(time.time() - start_time, 2)
    manifest = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "target": target,
        "elapsed_seconds": elapsed,
        "summary": {k: ("OK" if v else "SKIPPED") for k, v in results.items()},
    }

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"\n=== Ingestion Completed Successfully in {elapsed}s ===")
    print(f"Manifest written to: {MANIFEST_PATH}")
    return manifest


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "all"
    run_ingestion(target)
