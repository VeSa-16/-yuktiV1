# Data Model

Core logical entities:

- `SourceRegistry`
- `SourceEndpoint`
- `Dataset`
- `DatasetVersion`
- `RawArtifact`
- `IngestionRun`
- `IngestionError`
- `NormalizedRecord`
- `DataQualityReport`
- `ProvenanceRecord`
- `FreshnessRecord`
- `ConfidenceRecord`
- `TransformationVersion`
- `CalculationRun`
- `ModelVersion`
- `ScenarioRun`
- `DecisionTrace`
- `Scheme`
- `SchemeVersion`

## Immutable evidence principle

Raw artifacts and dataset versions should be append-only. A later correction creates a new version rather than mutating an earlier evidence snapshot.

## Minimal key relationships

`SourceRegistry 1—N SourceEndpoint 1—N DatasetVersion 1—N RawArtifact`  
`DatasetVersion 1—N NormalizedRecord`  
`NormalizedRecord N—1 ProvenanceRecord / ConfidenceRecord / FreshnessRecord`  
`CalculationRun N—1 input snapshot + versioned formula/model`  
`DecisionTrace 1—N evidence refs + calculation refs + scenario refs`
