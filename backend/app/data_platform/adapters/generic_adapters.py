from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx

from ..contracts import SourceFetchResult
from ..http import SourceUnavailable, request_json
from ..provenance import sha256_payload


class JsonHttpAdapter:
    """Generic JSON adapter for a verified endpoint; endpoint-specific mapping belongs in the caller."""

    def __init__(self, source_id: str, dataset_id: str, url: str, *, user_agent: str = "YUKTI/1.0") -> None:
        self.source_id = source_id
        self.dataset_id = dataset_id
        self.url = url
        self.user_agent = user_agent

    async def fetch(self, **params: Any) -> SourceFetchResult:
        headers = {"User-Agent": self.user_agent, "Accept": "application/json"}
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                payload = await request_json(client, "GET", self.url, params=params, headers=headers)
            except SourceUnavailable as exc:
                return SourceFetchResult(
                    source_id=self.source_id,
                    dataset_id=self.dataset_id,
                    retrieved_at=datetime.now(timezone.utc),
                    raw_payload=None,
                    status=exc.code,
                    source_url=self.url,
                    error=str(exc),
                )
        return SourceFetchResult(
            source_id=self.source_id,
            dataset_id=self.dataset_id,
            retrieved_at=datetime.now(timezone.utc),
            raw_payload=payload,
            status="SUCCESS",
            source_url=self.url,
            checksum_sha256=sha256_payload(payload),
        )

    def normalize(self, raw_payload: Any) -> list[dict[str, Any]]:
        if isinstance(raw_payload, dict) and isinstance(raw_payload.get("records"), list):
            return [r for r in raw_payload["records"] if isinstance(r, dict)]
        if isinstance(raw_payload, list):
            return [r for r in raw_payload if isinstance(r, dict)]
        if isinstance(raw_payload, dict):
            return [raw_payload]
        return []

    def validate(self, records: list[dict[str, Any]]) -> dict[str, Any]:
        null_fields = 0
        total_fields = 0
        for record in records:
            for value in record.values():
                total_fields += 1
                null_fields += int(value in (None, ""))
        return {
            "row_count": len(records),
            "null_rate": (null_fields / total_fields) if total_fields else 0.0,
            "duplicate_rate": 0.0,
            "valid": True,
            "errors": [],
        }
