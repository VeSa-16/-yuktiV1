# API Integration Matrix

| Source | Base / endpoint | Method | Auth | Request contract | Retry/cache | Verified here? | Implementation decision |
|---|---|---|---|---|---|---|---|
| data.gov.in | `https://api.data.gov.in/resource/{resource_id}` | GET | `api-key` for registered access | resource UUID + dataset-specific filters + `format=json` + `limit/offset` | exponential retry on 429/5xx; cache normalized response | documentation only | generic adapter; resource UUID comes from actual API page |
| Census India | official Census API documented at Census API docs | targeted GET | verify current | year 2001/2011, table ID, fields, filters, JSON/CSV | cache; historical source | documentation only | configurable endpoint adapter; no guessed path |
| WorldPop v2 | `https://api.worldpop.org/v2/population` | POST | optional `X-API-Key` | GeoJSON polygon, year 2015–2030, resolution 100m/1km | retry transient; poll task; cache by polygon+year+resolution | documentation verified | dedicated adapter |
| Overpass | `https://overpass-api.de/api/interpreter` (or approved instance) | POST | instance-dependent | QL query in `data` | bounded retry; query cache; quotas | policy/docs verified | targeted adapter; move to extracts for scale |
| Nominatim public | `https://nominatim.openstreetmap.org/search` / reverse | GET | none | explicit user action; no autocomplete/bulk | cache; <=1 req/s | policy verified, not integration-tested | use only deliberately; prefer own/provider geocoder for scale |
| Geofabrik | regional `.osm.pbf` | download | none | fixed extract URL | checksum + versioned import | current download page verified | scheduled ETL, not request-time API |
| RBI DBIE | portal-dependent | portal/download | varies | series-specific | release schedule + snapshot | portal verified | download/ETL first; API only after endpoint proof |
| TRAI reports | report download | GET | none | report/date | monthly cache | publication page verified | ETL parser; not treated as API |
| NPCI UPI stats | published stats page | GET/download | none | month/date | monthly snapshot | stats page verified | ETL snapshot |
| LGD | directory download page | GET/download | verify | state/entity selection | version snapshot | page verified | ETL/import |
| Maharashtra CMEGP | state portal/dashboard/documents | GET/download | none | scheme snapshot | versioned artifacts | current portal verified | rule-document ingestion |
| Agmarknet | **TBD** | **TBD** | **TBD** | **TBD** | **TBD** | **NO** | leave unverified; use other verified ag-market source/fallback |

## Required proof before marking an adapter LIVE

1. Resolve official endpoint from the publisher's current page.
2. Make a real HTTPS request.
3. Save a redacted raw response and checksum.
4. Record HTTP status, latency, timestamp, dataset version and headers where useful.
5. Validate expected fields.
6. Run at least one negative/failure test.
7. Confirm access/terms/licensing.
8. Set source registry status to `LIVE_VERIFIED` only after all eight pass.
