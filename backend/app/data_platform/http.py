from __future__ import annotations

import asyncio
import random
from collections.abc import Mapping
from typing import Any

import httpx


class SourceUnavailable(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


async def request_json(
    client: httpx.AsyncClient,
    method: str,
    url: str,
    *,
    params: Mapping[str, Any] | None = None,
    json: Any = None,
    headers: Mapping[str, str] | None = None,
    attempts: int = 3,
    timeout: float = 15.0,
) -> Any:
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            response = await client.request(
                method,
                url,
                params=params,
                json=json,
                headers=headers,
                timeout=timeout,
            )
            if response.status_code in {429, 502, 503, 504}:
                raise SourceUnavailable(
                    f"HTTP_{response.status_code}",
                    f"Transient upstream status {response.status_code}",
                )
            response.raise_for_status()
            return response.json()
        except (httpx.TimeoutException, httpx.NetworkError, SourceUnavailable) as exc:
            last_error = exc
            if attempt == attempts - 1:
                break
            delay = min(8.0, 0.5 * (2**attempt) + random.random() * 0.25)
            await asyncio.sleep(delay)
        except ValueError as exc:
            raise SourceUnavailable("MALFORMED_JSON", "Upstream returned invalid JSON") from exc
        except httpx.HTTPStatusError as exc:
            raise SourceUnavailable(
                f"HTTP_{exc.response.status_code}",
                f"Upstream returned HTTP {exc.response.status_code}",
            ) from exc
    raise SourceUnavailable(
        getattr(last_error, "code", "SOURCE_UNREACHABLE"),
        str(last_error) if last_error else "Source unavailable",
    )
