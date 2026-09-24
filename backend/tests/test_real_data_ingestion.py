"""
YUKTI Real Data Ingestion & Data Fusion Test Suite.
Verifies:
- LGD administrative resolution & historical alias mapping
- WorldPop 2025 catchment population calculations & coordinate validation
- HCES 2022-23 NSS Report 591 MPCE benchmark lookup
- Historical Irrigation XML parsing & crop profiles
- Economic Census & Demographics reference data
- Bhuvan Standards & Labour Bureau release calendar metadata
- Fused Evidence Bundle generation & provenance tags
- FastAPI Evidence API endpoints
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.data_platform.ingestion import (
    import_lgd_datasets,
    query_catchment_population,
    get_hces_benchmark,
    get_irrigation_profile,
    get_economic_profile,
    get_population_profile,
    import_bhuvan_metadata,
    import_labour_calendar,
)
from app.data_platform.fusion import generate_evidence_bundle, resolve_lgd_location

client = TestClient(app)


def test_lgd_importer_and_resolution():
    lgd = import_lgd_datasets()
    assert lgd["status"] == "SUCCESS"
    assert lgd["dataset_id"] == "LGD_ADMIN_MASTER"
    assert isinstance(lgd["villages"], list)

    res = resolve_lgd_location(lat=17.6599, lon=75.9064, state="Maharashtra", district="Ahmadnagar", subdistrict="Akola")
    assert res["district"] == "Ahilyanagar"
    assert res["district_historical_name"] == "Ahmadnagar"
    assert res["provenance_class"] == "SOURCE_DERIVED"


def test_worldpop_catchment():
    pop_5k = query_catchment_population(lat=17.6599, lon=75.9064, radius_km=5.0)
    assert pop_5k["dataset_id"] == "WORLDPOP_INDIA_2025_1KM"
    assert pop_5k["provenance_class"] == "MODEL_PREDICTION"
    assert pop_5k["catchment_radius_km"] == 5.0
    assert pop_5k["total_population"] > 0

    pop_10k = query_catchment_population(lat=17.6599, lon=75.9064, radius_km=10.0)
    assert pop_10k["total_population"] > pop_5k["total_population"]

    with pytest.raises(ValueError):
        query_catchment_population(lat=95.0, lon=75.0)


def test_hces_benchmark():
    mh_rural = get_hces_benchmark(state="Maharashtra", sector="RURAL", imputation_variant="WITHOUT_IMPUTATION")
    assert mh_rural["dataset_id"] == "HCES_2022_23_REPORT_591"
    assert mh_rural["monthly_per_capita_expenditure_inr"] == 4010.0
    assert mh_rural["provenance_class"] == "SOURCE_DERIVED"

    mh_rural_imp = get_hces_benchmark(state="Maharashtra", sector="RURAL", imputation_variant="WITH_IMPUTATION")
    assert mh_rural_imp["monthly_per_capita_expenditure_inr"] == 4125.0


def test_irrigation_profile():
    prof = get_irrigation_profile(taluka_name="Akola")
    assert prof["dataset_id"] == "AHILYANAGAR_IRRIGATION_2010_11"
    assert prof["taluka"].strip().lower() == "akola"
    assert prof["wheat_crop_area"] > 0
    assert prof["total_cultivated_area"] > 0


def test_economic_and_population_profiles():
    econ = get_economic_profile(district="Ahilyanagar")
    assert econ["dataset_id"] == "ECONOMIC_REPORT_COLLECTION"
    assert econ["total_enterprises"] > 0

    pop = get_population_profile(district="Solapur")
    assert pop["dataset_id"] == "POPULATION_REPORT_COLLECTION"
    assert pop["district_total_population"] == 4317756


def test_metadata_importers():
    bhuvan = import_bhuvan_metadata()
    assert bhuvan["dataset_id"] == "BHUVAN_GEOSPATIAL_STANDARDS_2015"
    assert bhuvan["classification"] == "REFERENCE_STANDARD"
    assert bhuvan["usable_as_data"] is False

    labour = import_labour_calendar()
    assert labour["dataset_id"] == "LABOUR_BUREAU_RELEASE_CALENDAR"
    assert labour["classification"] == "SCHEDULE_METADATA"
    assert labour["usable_as_data"] is False


def test_evidence_fusion_bundle():
    bundle = generate_evidence_bundle(
        lat=17.6599, lon=75.9064, state="Maharashtra", district="Ahilyanagar", subdistrict="Akola", sector="RURAL", catchment_radius_km=10.0
    )
    assert "location" in bundle
    assert "population" in bundle
    assert "consumption_context" in bundle
    assert "agricultural_context" in bundle
    assert "quality" in bundle
    assert "decision_trace" in bundle
    assert bundle["quality"]["overall_confidence"] > 0.0
    assert len(bundle["decision_trace"]) >= 3


def test_evidence_api_endpoints():
    r1 = client.get("/api/v1/evidence/fusion?lat=17.6599&lon=75.9064&district=Ahilyanagar&subdistrict=Akola")
    assert r1.status_code == 200
    data1 = r1.json()
    assert data1["location"]["district"] == "Ahilyanagar"

    r2 = client.get("/api/v1/evidence/catchment-population?lat=17.6599&lon=75.9064&radius_km=10")
    assert r2.status_code == 200
    assert r2.json()["total_population"] > 0

    r3 = client.get("/api/v1/evidence/hces-benchmark?state=Maharashtra&sector=RURAL")
    assert r3.status_code == 200
    assert r3.json()["monthly_per_capita_expenditure_inr"] == 4010.0

    r4 = client.get("/api/v1/evidence/irrigation-profile?taluka=Sangamner")
    assert r4.status_code == 200
    assert r4.json()["total_cultivated_area"] > 0

    r5 = client.get("/api/v1/evidence/standards-and-metadata")
    assert r5.status_code == 200
    assert r5.json()["bhuvan_standards"]["dataset_id"] == "BHUVAN_GEOSPATIAL_STANDARDS_2015"
