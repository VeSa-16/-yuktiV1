# YUKTI Dynamic Data Research

**Research date:** 2026-09-24  
**Research rule:** primary/official source preferred. A source is only called “live” after a real endpoint/integration test is completed in the target repository.

## Source matrix

| Source | Owner | Purpose | Granularity | Time semantics | Access | API? | Auth | Freshness strategy | License / terms | YUKTI status |
|---|---|---|---|---|---|---|---|---|---|---|
| data.gov.in / OGD | NIC + dataset publishers | Government datasets/catalog/API resources | dataset-specific | dataset-specific | API or downloads | Yes for selected resources | API key for registered access | dataset-specific TTL | G-Open Data License where applicable; verify per resource | documentation verified, target repo not integration-tested |
| Census API | ORGI/Census India | Demography, workers, households, etc. | table-dependent, including published aggregates | 2001/2011 in documented API | targeted API + bulk tables | Yes | verify current access requirements | long-lived historical; not “freshness” in daily sense | verify Census terms | documentation verified |
| MoSPI / e-Sankhyiki | MoSPI | household consumption, labour/economic context | report/dataset-specific | release-specific | portal/downloads | dataset-specific | dataset-specific | release-calendar based | verify dataset terms | research target |
| RBI DBIE | RBI | macro/financial environment, banking, payment indicators | series-dependent | daily/monthly/annual depending indicator | portal/downloads | portal dependent | varies | indicator-specific | RBI terms | documentation verified |
| Agmarknet | Directorate of Marketing & Inspection | mandi prices/arrivals | mandi/commodity/report-defined | daily/periodic | web services/data access must be re-verified | unclear for a current supported public API | verify | daily-source policy only after endpoint confirmation | verify portal terms | **UNVERIFIED endpoint** |
| e-NAM | SFAC/Ministry of Agriculture | market prices/auction/public market information | APMC/commodity, per public view | transaction/report-defined | portal | no production adapter claimed | varies | publish-time | verify | public-data semantics documented |
| OSM / Overpass | OSM ecosystem | mapped POIs, roads, amenities | spatial query | current OSM state | Overpass | Yes | instance-dependent | cache; not page-render fetch | ODbL + service policy | docs verified |
| Geofabrik India | Geofabrik + OSM contributors | bulk OSM extracts | regional | extract snapshot; typically daily | PBF/GeoPackage | file distribution | none | extract timestamp/version | ODbL | docs verified |
| WorldPop v2 | WorldPop / University of Southampton | population surface/statistics | polygon, 100m/1km | 2015-2030 data years | REST | Yes | no key for base quota; key for higher limits | data-year + retrieval timestamp | dataset-specific terms | docs verified |
| LGD | Ministry of Panchayati Raj | admin hierarchy/local body mapping | district/subdistrict/village/local body | directory snapshot/modification | downloads | portal-defined | verify | version/snapshot based | verify | docs verified |
| TRAI reports | TRAI | telecom/subscription context | report-defined, not automatically village quality | monthly | downloadable reports | not treated as API | none | monthly | official report terms | verified current publication cadence |
| NPCI UPI stats | NPCI | digital payments context | aggregate published statistics | daily/monthly | published stats | no public village API claimed | none | daily/monthly | official publication | verified current publication cadence |
| Maharashtra CMEGP | Maharashtra Industries Department | state scheme context | scheme-defined | current dashboard/document snapshot | portal/PDF | public dashboard | none | scheme/version based | official docs | verified existence/current portal |

## High-confidence implementation recommendations

### Population
Use **Census as historical baseline** and **WorldPop as a modelled contemporary spatial estimate**. Never label WorldPop as a census measurement. WorldPop v2 currently documents 2015–2030 coverage, polygon queries, 100m/1km resolutions, a no-key baseline quota, and a higher quota with an API key. https://api.worldpop.org/v2/

### Administrative hierarchy
Use LGD as a normalization key where suitable. This should sit above source-specific location facts, because the same village/subdistrict names can be ambiguous.

### Mapped businesses
Use OSM/Overpass for observed mapped businesses, but expose **coverage** separately. `0` mapped businesses is not evidence of `0` real businesses.

### Rural connectivity
Use TRAI as broad telecom context only where its report granularity supports the claim. Do not infer village-level internet quality from aggregate telecom statistics.

### Digital payments
Use NPCI as aggregate UPI context. Do not convert national/monthly UPI volume into a village payment-adoption percentage without a legitimate granular source.

### Macro/finance
Use RBI DBIE series for macro and banking environment indicators, with series-specific timestamps and units.

### Government schemes
Store scheme rules as versioned documents/objects, not hard-coded UI copy. For each rule, persist effective date and verification date.

## Current verification highlights

- OGD currently catalogs thousands of datasets and identifies API-enabled resources separately; the portal also documents API-key generation for registered users. https://data.gov.in/catalogs https://data.gov.in/help
- Census India explicitly documents a published aggregate API covering most 2011 and 2001 Census tables; it is targeted and does not expose individual/household-level re-identifying data. https://censusindia.gov.in/census.website/en/data/api/about
- WorldPop v2 currently exposes REST endpoints for polygon population statistics, with explicit data years and resolution parameters. https://api.worldpop.org/v2/
- Geofabrik provides current OSM India extracts and states ODbL 1.0 for the derived data it distributes. https://download.geofabrik.de/asia/india.html
- OSM's public Nominatim service has a maximum of 1 request/second, requires identifying User-Agent/Referer, and discourages periodic bulk geocoding; systematic/bulk use should move to extracts or a self-hosted/other service. https://operations.osmfoundation.org/policies/nominatim/
- OSM's API policy emphasizes that the editing API is not for read-only bulk use; larger users should use planet/extracts or another provider. https://operations.osmfoundation.org/policies/api/
- TRAI publishes monthly subscription reports; the current publication page lists July 2026 and earlier 2026 reports. https://www.trai.gov.in/release-publication/reports/telecom-subscriptions-reports
- NPCI publishes current UPI daily/monthly statistics; the current page includes April–August 2026 monthly figures. https://www.npci.org.in/product/upi/product-statistics
- Maharashtra's Industries Department currently publishes CMEGP information and a 2025 state Industries, Investment & Services Policy; the department also lists CMEGP among DIC-implemented schemes. https://industry.maharashtra.gov.in/en/cm-dashboard/overview https://industry.maharashtra.gov.in/en/publication/gr

## Source-specific freshness defaults (YUKTI design choices)

| Class | Example | Default policy |
|---|---|---|
| Daily market | mandi/price | expected refresh 24h; stale after 4× interval unless source says otherwise |
| Monthly official report | TRAI | expected refresh 31d; do not penalize beyond historical-report semantics |
| Census baseline | Census 2011 | freshness is `HISTORICAL_REFERENCE`, not stale; confidence changes with use case |
| Modelled annual spatial surface | WorldPop | freshness tied to `data_year` and model vintage, not API retrieval age |
| OSM extract | Geofabrik | freshness tied to extract date; source coverage still incomplete |
| Scheme guideline | current policy PDF/order | valid only through verified effective/version dates |
| RBI series | indicator-specific | source schedule drives TTL |

## Not yet safe to call “live”

Agmarknet's current public API/access path could not be verified from a primary endpoint in this session. It must remain `UNVERIFIED` until a real endpoint request + sample response + terms check has succeeded.
