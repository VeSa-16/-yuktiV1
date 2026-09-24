# Production Roadmap

## Prototype

- deterministic finance/scoring
- offline demo fixtures
- source-aware UI
- first verified data adapters
- versioned scheme records

## Pilot: 1–2 districts

- scheduled ingestion worker
- object storage for raw artifacts
- Postgres/appropriate spatial database if current DB cannot support scale
- spatial indexes
- monitoring dashboards
- operator review of source errors
- data licensing review

## State scale

- queue-based ingestion
- partitioned normalized tables
- regional OSM extracts
- admin hierarchy normalization
- cache-first API
- source-specific freshness schedules

## National scale

- object storage + immutable raw artifact retention
- horizontally scalable ingestion workers
- spatial database/indexing
- CDN/API cache
- source-health SLOs
- schema migration discipline
- model registry
- audit and human-review workflow
- legal/license governance

The actual repository stack should be preserved unless it creates a documented blocker.
