from __future__ import annotations

from typing import Any

import httpx

from ..contracts import SourceFetchResult
from ..http import SourceUnavailable, request_json
from ..provenance import sha256_payload


class WorldPopV2Adapter:
    source_id = "worldpop-v2"
    dataset_id = "worldpop-global2"
    base_url = "https://api.worldpop.org/v2"

    async def fetch(self, *, geojson: dict[str, Any], year: int, resolution: str = "100m") -> SourceFetchResult:
        if year < 2015 or year > 2030:
            raise ValueError("WorldPop v2 documents years 2015-2030")
        if resolution not in {"100m", "1km"}:
            raise ValueError("resolution must be 100m or 1km")
        payload = {"geojson": geojson, "year": year, "resolution": resolution}
        async with httpx.AsyncClient(follow_redirects=True) as client:
            try:
                response = await request_json(client, "POST", f"{self.base_url}/population", json=payload)
                return SourceFetchResult(
                    source_id=self.source_id,
                    dataset_id=f"{self.dataset_id}-{year}-{resolution}",
                    retrieved_at=SourceFetchResult.now(),
                    raw_payload=response,
                    status="SUCCESS",
                    source_url=f"{self.base_url}/population",
                    dataset_version=str(year),
                    checksum_sha256=sha256_payload(response),
                )
            except SourceUnavailable as exc:
                return SourceFetchResult(
                    source_id=self.source_id,
                    dataset_id=f"{self.dataset_id}-{year}-{resolution}",
                    retrieved_at=SourceFetchResult.now(),
                    raw_payload=None,
                    status=exc.code,
                    source_url=f"{self.base_url}/population",
                    dataset_version=str(year),
                    error=str(exc),
                )

    def normalize(self, raw_payload: Any) -> list[dict[str, Any]]:
        if not isinstance(raw_payload, dict):
            return []
        return [raw_payload.get("result", raw_payload)]

    def validate(self, records: list[dict[str, Any]]) -> dict[str, Any]:
        valid = all(
            isinstance(r.get("total_population"), (int, float)) and r["total_population"] >= 0
            for r in records
        )
        return {"row_count": len(records), "valid": valid, "errors": [] if valid else ["invalid population"]}
