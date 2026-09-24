from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone


@dataclass(frozen=True)
class FreshnessPolicy:
    expected_refresh_hours: float | None
    max_acceptable_age_hours: float | None = None


def classify_freshness(
    retrieved_at: datetime | None,
    policy: FreshnessPolicy,
    *,
    now: datetime | None = None,
) -> tuple[str, float | None, float | None]:
    """Return (status, score, age_hours). Score is None when freshness is undefined."""
    if retrieved_at is None:
        return "UNKNOWN", None, None
    now = now or datetime.now(timezone.utc)
    if retrieved_at.tzinfo is None:
        retrieved_at = retrieved_at.replace(tzinfo=timezone.utc)
    age_hours = max(0.0, (now - retrieved_at).total_seconds() / 3600.0)
    expected = policy.expected_refresh_hours
    maximum = policy.max_acceptable_age_hours
    if expected is None and maximum is None:
        return "UNKNOWN", None, age_hours
    if maximum is not None and age_hours > maximum:
        return "EXPIRED", 0.0, age_hours
    if expected is None:
        return "RECENT", 1.0, age_hours
    if age_hours <= expected:
        return "FRESH", 1.0, age_hours
    if age_hours <= 2 * expected:
        return "RECENT", max(0.5, 1 - (age_hours - expected) / expected * 0.5), age_hours
    if age_hours <= 4 * expected:
        return "AGING", max(0.2, 0.5 - (age_hours - 2 * expected) / (2 * expected) * 0.3), age_hours
    return "STALE", 0.1, age_hours
