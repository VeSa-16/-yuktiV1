from __future__ import annotations

import hashlib
import json
from typing import Any


def sha256_payload(payload: Any) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str).encode()
    return hashlib.sha256(canonical).hexdigest()


def provenance_record(
    *,
    source_id: str | None,
    dataset_id: str | None,
    source_url: str | None,
    retrieved_at: str | None,
    reference_period: str | None,
    dataset_version: str | None,
    transformation_version: str | None,
    calculation_version: str | None,
    classification: str,
    limitations: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "source_id": source_id,
        "dataset_id": dataset_id,
        "source_url": source_url,
        "retrieved_at": retrieved_at,
        "reference_period": reference_period,
        "dataset_version": dataset_version,
        "transformation_version": transformation_version,
        "calculation_version": calculation_version,
        "classification": classification,
        "limitations": limitations or [],
    }
