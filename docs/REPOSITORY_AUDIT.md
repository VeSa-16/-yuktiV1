# YUKTI Repository Audit

**Audit date:** 2026-09-24  
**Repository:** https://github.com/VeSa-16/-yuktiV1  
**Audit scope:** public repository metadata + README-level verification.  
**Limitation:** the execution environment could not clone/fetch repository files; direct GitHub tree/file retrieval was blocked. Therefore this is a **partial forensic audit**, not a claim of source-level verification.

## Confirmed public structure

The public GitHub page shows 44 commits and these top-level entries:

- `.github/workflows`
- `archive/static_data`
- `backend`
- `docs`
- `frontend`
- `scripts`
- `.env.example`
- `.gitignore`
- `README.md`
- `YUKTI_Data_Strategy_and_Data_Architecture.md`
- `YUKTI_File_Structure.md`
- `YUKTI_Prototype_Code.md`
- `docker-compose.yml`
- `start_yukti.bat`

The README identifies the product as **YUKTI - Pre-Investment Decision Traceable Chain**, SIH 2026 PS 26091. It also states that the financial engine lives at `app/engines/financial_engine.py`, the scoring engine at `app/engines/scoring_engine.py`, and the AI business matcher at `app/ai_layer/business_matcher.py`.

## Architecture claims verified from README

| Area | Publicly stated | Source-of-truth status |
|---|---|---|
| Product | Traceable pre-investment decision chain | README verified |
| Backend | Python application | README path/API names imply Python; exact framework not fully re-read |
| Financial math | Deterministic, including ROI/DSCR/EMI/break-even | README claim, source-level verification blocked |
| Scoring | Deterministic scoring engine | README claim, source-level verification blocked |
| AI | Semantic routing/business matching only | README claim, source-level verification blocked |
| Live data | Solapur-specific prototype; no fabricated live endpoints claimed | README claim |
| Offline demo | Core engine intended to work offline | README claim |
| Tests | pytest suite referenced | README claim; test files not directly inspectable |
| Frontend | Present | File tree verified |
| Deployment | Docker + batch startup present | File tree verified |

## High-risk verification items before merge

1. Confirm exact backend framework and dependency versions.
2. Read all existing models and routes before adding persistent source/provenance tables.
3. Confirm current DB technology and migration strategy.
4. Inspect the existing checklist/product spec file and map every route/component.
5. Inspect `archive/static_data` to identify which values must be reclassified as `SYNTHETIC_DEMO`, `CURATED`, `BENCHMARK_ESTIMATE`, or `SOURCE_DERIVED`.
6. Confirm the existing deterministic finance formulas and preserve them unless tests show an error.
7. Confirm current AI integration and enforce hard numeric-tool boundaries.

## Change strategy

Do **not** replace the existing application with a new scaffold. The required upgrade is additive/refactoring-first:

`existing app → data platform boundary → normalized evidence → decision engines → UI provenance`

The target integration point is a source registry + ingestion service that produces normalized, versioned facts. Existing financial/scoring engines consume those facts through typed interfaces rather than making external HTTP calls themselves.
