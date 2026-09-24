# Provenance Specification

## Required classifications

`USER_PROVIDED`, `VERIFIED_EXTERNAL`, `SOURCE_DERIVED`, `CALCULATED`, `BENCHMARK_ESTIMATE`, `MODEL_PREDICTION`, `AI_INFERRED`, `CURATED`, `SYNTHETIC_DEMO`, `ASSUMPTION`, `SCENARIO`, `UNAVAILABLE`, `UNVERIFIED`.

## Provenance record

```json
{
  "source_id": "worldpop-v2",
  "dataset_id": "worldpop-global2-2026-100m",
  "source_url": "https://api.worldpop.org/v2/population",
  "retrieved_at": "2026-09-24T12:00:00Z",
  "reference_period": "2026",
  "dataset_version": "2026",
  "transformation_version": "population-normalizer@1.0.0",
  "calculation_version": null,
  "classification": "SOURCE_DERIVED",
  "limitations": ["modelled population estimate", "not a census measurement"]
}
```

## Decision trace

Every material recommendation should link to:

`recommendation → reason → input snapshot → source versions → transformation versions → formula/model version → assumptions → confidence → change conditions`

## Conflict handling

When credible sources disagree, keep both facts with timestamps and source identities. A reconciliation object may add a preferred value only when the rule is explicit and auditable; never overwrite the original measurements.
