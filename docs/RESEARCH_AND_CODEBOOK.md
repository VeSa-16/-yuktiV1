# YUKTI Research & Codebook

This file contains copy-paste-ready building blocks for the dynamic-data layer. They are **not claimed to be merged into the public repository** because the repository could not be fetched/written in this execution.

## 1. Shared contract

File: `backend/app/data_platform/contracts.py`

```python
# Copy the complete file from:
# backend/app/data_platform/contracts.py in this pack.
```

## 2. Resilient HTTP

File: `backend/app/data_platform/http.py`

```python
# Copy the complete file from:
# backend/app/data_platform/http.py in this pack.
```

## 3. data.gov.in adapter

Official portal documentation identifies API resources under `api.data.gov.in/` and documents API-key generation for registered users. API existence is resource-specific, so YUKTI must store a concrete `resource_id` from the actual dataset API page. 

```python
from app.data_platform.adapters.data_gov import DataGovIndiaAdapter

adapter = DataGovIndiaAdapter(
    resource_id="<VERIFIED_RESOURCE_UUID>",
    api_key=os.environ["DATA_GOV_API_KEY"],
)
result = await adapter.fetch(offset=0, limit=100)
```

Do not replace `<VERIFIED_RESOURCE_UUID>` with an invented UUID.

## 4. Census India published aggregate API

The official documentation states that the API supports published aggregate Census tables from 2001 and 2011, targeted queries, table IDs, filters, fields, paging and JSON/CSV output.

```python
from app.data_platform.adapters.census import CensusIndiaAdapter

adapter = CensusIndiaAdapter(
    api_base_url=os.environ["CENSUS_API_BASE_URL"]
)
result = await adapter.fetch(
    year=2011,
    table_id="<VERIFIED_TABLE_ID>",
    fields="<field1>,<field2>",
    state="<verified-filter>",
)
```

The concrete API base URL/table ID must be resolved from the current official documentation before enabling production mode.

## 5. WorldPop v2

WorldPop documents `POST /population`, with GeoJSON WGS84 polygon, year 2015–2030 and 100m/1km resolution. It documents no-key baseline limits and higher limits using `X-API-Key`.

```python
from app.data_platform.adapters.worldpop import WorldPopV2Adapter

adapter = WorldPopV2Adapter()
result = await adapter.fetch(
    geojson=polygon_geojson,
    year=2026,
    resolution="100m",
)
```

Persist the WorldPop `data_year` separately from `retrieved_at`.

## 6. Overpass

```python
from app.data_platform.adapters.overpass import OverpassAdapter

adapter = OverpassAdapter()
result = await adapter.fetch(query=overpass_query)
```

Use only targeted queries, cache results, and move bulk workloads to extracts. OSMF policies place limits on public services; Nominatim is limited to one request/second and systematic/bulk geocoding is discouraged. For scale, use Geofabrik extracts or your own service.

## 7. Freshness

```python
from app.data_platform.freshness import FreshnessPolicy, classify_freshness

status, score, age_hours = classify_freshness(
    retrieved_at,
    FreshnessPolicy(expected_refresh_hours=24),
)
```

## 8. Confidence

```python
from app.data_platform.confidence import ConfidenceFactors, confidence_score

score = confidence_score(
    ConfidenceFactors(
        source_authority=0.95,
        freshness=0.80,
        spatial_granularity=0.70,
        temporal_granularity=0.80,
        completeness=0.90,
        corroboration=0.60,
        methodology=0.90,
        directness=0.85,
    )
)
```

This is a YUKTI evidence-quality indicator, not a statistical probability.

## 9. Provenance

```python
from app.data_platform.provenance import provenance_record

prov = provenance_record(
    source_id="worldpop-v2",
    dataset_id="worldpop-global2-2026-100m",
    source_url="https://api.worldpop.org/v2/population",
    retrieved_at="2026-09-24T12:00:00Z",
    reference_period="2026",
    dataset_version="2026",
    transformation_version="population-normalizer@1.0.0",
    calculation_version=None,
    classification="SOURCE_DERIVED",
    limitations=["modelled population estimate"],
)
```

## 10. Test

Install:

```bash
pip install httpx pytest
```

Run:

```bash
pytest -q backend/tests/test_data_platform.py
```

## 11. Fallback contract

```text
LIVE_SOURCE
    ↓ unavailable
FRESH_CACHE
    ↓ unavailable
LAST_VERIFIED
    ↓ unavailable
BENCHMARK_OR_MODEL_ESTIMATE
    ↓ unavailable
NOT_AVAILABLE
```

Every transition must be visible to the UI and recorded in the decision trace.
