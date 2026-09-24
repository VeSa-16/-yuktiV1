from __future__ import annotations

from typing import Any

from .generic_adapters import JsonHttpAdapter


class DataGovIndiaAdapter(JsonHttpAdapter):
    """Adapter for one verified data.gov.in resource UUID.

    The portal exposes resource endpoints under api.data.gov.in. The exact resource UUID
    must come from the dataset's API page; this class intentionally refuses an empty UUID.
    """

    def __init__(self, resource_id: str, *, api_key: str, user_agent: str = "YUKTI/1.0") -> None:
        if not resource_id:
            raise ValueError("resource_id is required")
        if not api_key:
            raise ValueError("DATA_GOV_API_KEY is required for authenticated requests")
        self.resource_id = resource_id
        self.api_key = api_key
        super().__init__(
            source_id="data.gov.in",
            dataset_id=resource_id,
            url=f"https://api.data.gov.in/resource/{resource_id}",
            user_agent=user_agent,
        )

    async def fetch(self, **params: Any):
        params = {"api-key": self.api_key, "format": "json", "limit": 100, **params}
        return await super().fetch(**params)
