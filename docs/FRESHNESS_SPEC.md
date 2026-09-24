# Freshness Specification

## Statuses

`FRESH`, `RECENT`, `AGING`, `STALE`, `EXPIRED`, `UNKNOWN`.

Historical sources may additionally use a semantic state such as `HISTORICAL_REFERENCE` instead of treating old but intentionally valid statistics as stale.

## Algorithm

For sources with an expected interval `E` and current age `A`:

- `A <= E` → FRESH, score 1.0
- `E < A <= 2E` → RECENT, score decays to ~0.5
- `2E < A <= 4E` → AGING, score decays toward ~0.2
- `4E < A` → STALE, score 0.1 unless a maximum acceptable age makes it EXPIRED

For sources without refresh semantics, freshness score is undefined and source validity is handled through version/reference-period semantics.

## Critical rule

A daily market feed, a monthly telecom report, a 2011 Census table, and a 2026 policy order must not share one universal TTL.
