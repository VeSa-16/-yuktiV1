from __future__ import annotations

from typing import Any

import httpx

from ..contracts import SourceFetchResult
from ..http import SourceUnavailable, request_json
from ..provenance import sha256_payload


class OverpassAdapter:
    source_id = "osm-overpass"

    def __init__(self, endpoint: str = "https://overpass-api.de/api/interpreter", *, user_agent: str = "YUKTI/1.0"):
        if not endpoint.startswith("https://"):
            raise ValueError("Overpass endpoint must be HTTPS")
        self.endpoint = endpoint
        self.user_agent = user_agent

    async def fetch(self, *, query: str, timeout_seconds: int = 25) -> SourceFetchResult:
        headers = {"User-Agent": self.user_agent, "Accept": "application/json"}
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                response = await request_json(
                    client,
                    "POST",
                    self.endpoint,
                    params={"data": query},
                    headers=headers,
                    timeout=float(timeout_seconds),
                )
                return SourceFetchResult(
                    source_id=self.source_id,
                    dataset_id="overpass-osm-query",
                    retrieved_at=SourceFetchResult.now(),
                    raw_payload=response,
                    status="SUCCESS",
                    source_url=self.endpoint,
                    checksum_sha256=sha256_payload(response),
                )
            except SourceUnavailable as exc:
                return SourceFetchResult(
                    source_id=self.source_id,
                    dataset_id="overpass-osm-query",
                    retrieved_at=SourceFetchResult.now(),
                    raw_payload=None,
                    status=exc.code,
                    source_url=self.endpoint,
                    error=str(exc),
                )

    def normalize(self, raw_payload: Any) -> list[dict[str, Any]]:
        if isinstance(raw_payload, dict) and isinstance(raw_payload.get("elements"), list):
            return [e for e in raw_payload["elements"] if isinstance(e, dict)]
        return []

    def validate(self, records: list[dict[str, Any]]) -> dict[str, Any]:
        invalid_geometry = 0
        for record in records:
            if "lat" in record and not -90 <= float(record["lat"]) <= 90:
                invalid_geometry += 1
            if "lon" in record and not -180 <= float(record["lon"]) <= 180:
                invalid_geometry += 1
        return {
            "row_count": len(records),
            "invalid_geometry": invalid_geometry,
            "valid": invalid_geometry == 0,
            "errors": [] if invalid_geometry == 0 else ["invalid coordinate"],
        }
