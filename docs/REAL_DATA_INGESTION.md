# YUKTI Real Data Ingestion Architecture & Runbook

## Overview
This document describes YUKTI's real data ingestion framework, dataset deduplication, provenance tracking, and API integration.

## Reproducible Ingestion Command
To run ingestion programmatically across all raw dataset files:

```bash
cd backend
.\venv\Scripts\python.exe -m app.data_platform.ingest_cli all
```

Individual targets supported:
- `lgd`: Ingests LGD XML spreadsheets from ZIP archives
- `worldpop`: Inspects and registers WorldPop 2025 1km raster surface
- `hces`: Ingests NSS Report 591 MPCE benchmarks
- `irrigation`: Ingests 2010-11 Ahilyanagar Irrigation XML
- `economic`: Ingests Economic Census district profiles
- `population`: Ingests Solapur Census demographic reference tables
- `metadata`: Registers Bhuvan Standards & Labour Bureau release calendar

An execution manifest is written to `data/import_manifest.json`.

## Data Provenance Classes
1. `VERIFIED_EXTERNAL`: Official administrative master (LGD)
2. `MODEL_PREDICTION`: Modelled spatial surfaces (WorldPop 2025 1km raster)
3. `SOURCE_DERIVED`: Published sample survey aggregates (HCES Report 591, Economic Census)
4. `HISTORICAL`: Historical baseline datasets (2010-11 Irrigation XML, Census 2011)
5. `REFERENCE_STANDARD`: GIS & mapping governance metadata (Bhuvan 2015 Standards)
6. `SCHEDULE_METADATA`: Ingestion schedule metadata (Labour Bureau WRI Calendar)

## API Endpoints
- `GET /api/v1/evidence/fusion`: Returns complete fused evidence bundle
- `GET /api/v1/evidence/catchment-population`: Returns geodesic catchment population estimate
- `GET /api/v1/evidence/hces-benchmark`: Returns HCES MPCE expenditure benchmarks
- `GET /api/v1/evidence/irrigation-profile`: Returns historical crop & irrigation area profile
- `GET /api/v1/evidence/lgd-resolve`: Resolves administrative LGD codes and historical name aliases
- `GET /api/v1/evidence/standards-and-metadata`: Returns Bhuvan standards & Labour Bureau calendar metadata
