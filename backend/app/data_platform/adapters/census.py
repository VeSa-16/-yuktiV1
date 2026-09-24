from __future__ import annotations

from typing import Any

from .generic_adapters import JsonHttpAdapter


class CensusIndiaAdapter(JsonHttpAdapter):
    """Targeted adapter for the published Census API.

    The API documents support 2001/2011, table IDs, filters, fields and JSON/CSV output.
    The concrete table/query path should be configured from the official Census API docs,
    not guessed in application code.
    """

    def __init__(self, api_base_url: str, *, user_agent: str = "YUKTI/1.0") -> None:
        if not api_base_url.startswith("https://"):
            raise ValueError("Census API base URL must be HTTPS")
        super().__init__(
            source_id="census-india",
            dataset_id="published-aggregate-census",
            url=api_base_url.rstrip("/"),
            user_agent=user_agent,
        )

    async def fetch(self, *, year: int, table_id: str, fields: str, **filters: Any):
        if year not in {2001, 2011}:
            raise ValueError("Published Census API currently documents 2001 or 2011")
        if not table_id or not fields:
            raise ValueError("table_id and fields are required")
        params = {"fields": fields, "format": "JSON", **filters}
        result = await super().fetch(**params)
        result = result.__class__(
            source_id=result.source_id,
            dataset_id=f"census-{year}-{table_id}",
            retrieved_at=result.retrieved_at,
            raw_payload=result.raw_payload,
            status=result.status,
            source_url=result.source_url,
            dataset_version=str(year),
            etag=result.etag,
            last_modified=result.last_modified,
            checksum_sha256=result.checksum_sha256,
            error=result.error,
        )
        return result
