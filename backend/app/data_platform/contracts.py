from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Protocol


DATA_CLASSIFICATIONS = {
    "USER_PROVIDED",
    "VERIFIED_EXTERNAL",
    "SOURCE_DERIVED",
    "CALCULATED",
    "BENCHMARK_ESTIMATE",
    "MODEL_PREDICTION",
    "AI_INFERRED",
    "CURATED",
    "SYNTHETIC_DEMO",
    "ASSUMPTION",
    "SCENARIO",
    "UNAVAILABLE",
    "UNVERIFIED",
}


@dataclass(frozen=True)
class SourceFetchResult:
    source_id: str
    dataset_id: str
    retrieved_at: datetime
    raw_payload: Any
    status: str
    source_url: str
    dataset_version: str | None = None
    etag: str | None = None
    last_modified: str | None = None
    checksum_sha256: str | None = None
    error: str | None = None

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)


@dataclass(frozen=True)
class MetricValue:
    value: float | int | str | None
    unit: str | None
    provenance: str
    source_id: str | None
    source_url: str | None
    reference_period: str | None
    retrieved_at: str | None
    dataset_version: str | None
    freshness: str
    confidence: float | None
    limitations: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        if self.provenance not in DATA_CLASSIFICATIONS:
            raise ValueError(f"Unsupported provenance: {self.provenance}")
        if self.confidence is not None and not 0.0 <= self.confidence <= 1.0:
            raise ValueError("confidence must be in [0, 1]")


class DataSourceAdapter(Protocol):
    source_id: str

    async def fetch(self, **params: Any) -> SourceFetchResult:
        ...

    def normalize(self, raw_payload: Any) -> list[dict[str, Any]]:
        ...

    def validate(self, records: list[dict[str, Any]]) -> dict[str, Any]:
        ...
