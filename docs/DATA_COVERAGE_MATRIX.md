# YUKTI Real Data Coverage & Provenance Matrix

| Evidence Layer | Canonical Source ID | Geography Level | Temporal Period | Spatial Resolution | Provenance Class | Freshness | Used By Module | Limitation / Caveat |
| -------------- | ------------------- | --------------- | --------------- | ------------------ | ---------------- | --------- | -------------- | ------------------- |
| Administrative Master | `LGD_ADMIN_MASTER` | State / District / Subdistrict / Village | 2026 Master | Hierarchy Entity Graph | `VERIFIED_EXTERNAL` | Recent | Location Intelligence | Master admin registry; historical name aliases preserved |
| Catchment Population | `WORLDPOP_INDIA_2025_1KM` | Grid Surface (India) | 2025 | 1km (~30 arc-sec) | `MODEL_PREDICTION` | 2025 | Feasibility / Catchment Engine | Modelled raster grid surface; not Census door-to-door count |
| Household Consumption | `HCES_2022_23_REPORT_591` | State / Sector (Rural/Urban) | Aug 2022 – Jul 2023 | State Aggregate | `SOURCE_DERIVED` | 2022-23 | Market Benchmark Engine | Regional survey benchmark; not village-level spend |
| Irrigation & Crop Profile | `AHILYANAGAR_IRRIGATION_2010_11` | District / Taluka | 2010-11 | Taluka level | `HISTORICAL` | 2010-11 Baseline | Agriculture Feasibility Module | Historical baseline; do not treat as current cultivation |
| District Economic Profile | `ECONOMIC_REPORT_COLLECTION` | District | Economic Census | District Macro | `SOURCE_DERIVED` | Macro Baseline | Market Intelligence | District-level MSME macro profile |
| Population Census Baseline | `POPULATION_REPORT_COLLECTION` | District / Village | Census 2011 | Village Table | `HISTORICAL` | 2011 | Demographics Baseline | Census reference count; distinct from WorldPop 2025 grid |
| GIS Standards Metadata | `BHUVAN_GEOSPATIAL_STANDARDS_2015` | National | 2015 | Reference Standard | `REFERENCE_STANDARD` | 2015 | Dataset Registry Governance | Metadata standard; not a live data feed |
| Ingestion Release Schedule | `LABOUR_BUREAU_RELEASE_CALENDAR` | National | Monthly Schedule | Metadata | `SCHEDULE_METADATA` | Active | Pipeline Ingestion Scheduler | Release schedule metadata; not wage observations |
