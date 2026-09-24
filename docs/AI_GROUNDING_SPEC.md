# AI Grounding Specification

## Allowed

- classify unstructured business idea into controlled taxonomy
- summarize evidence
- explain deterministic calculations
- translate grounded content
- generate action plans from structured facts
- answer source-grounded questions

## Forbidden

- calculating EMI/DSCR/ROI
- creating government thresholds
- inventing local competitors
- inventing market prices
- fabricating eligibility
- converting missing data into plausible numeric guesses

## Context bundle

```text
business profile
location/admin hierarchy
market evidence
financial snapshot
scheme matches
scenario state
provenance/freshness/confidence
formula/model versions
source URLs
```

Responses cite evidence references such as `[Source 1]`, `[Calc 2]`, `[Scenario 3]` that resolve back to persisted records.

When the AI service is unavailable, the UI falls back to deterministic narrative templates and source-linked data cards.
