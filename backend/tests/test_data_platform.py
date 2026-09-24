from datetime import datetime, timedelta, timezone

import pytest

from app.data_platform.confidence import ConfidenceFactors, confidence_score
from app.data_platform.freshness import FreshnessPolicy, classify_freshness
from app.data_platform.provenance import sha256_payload
from app.data_platform.contracts import MetricValue


def test_freshness_daily_source():
    now = datetime(2026, 9, 24, tzinfo=timezone.utc)
    status, score, age = classify_freshness(
        now - timedelta(hours=2), FreshnessPolicy(expected_refresh_hours=24), now=now
    )
    assert status == "FRESH"
    assert score == 1.0
    assert age == 2.0


def test_freshness_stale():
    now = datetime(2026, 9, 24, tzinfo=timezone.utc)
    status, score, _ = classify_freshness(
        now - timedelta(hours=240), FreshnessPolicy(expected_refresh_hours=24), now=now
    )
    assert status == "STALE"
    assert score == 0.1


def test_confidence_is_deterministic():
    factors = ConfidenceFactors(0.9, 0.8, 0.7, 0.8, 0.9, 0.6, 0.9, 0.8)
    assert confidence_score(factors) == confidence_score(factors)


def test_metric_confidence_bounds():
    with pytest.raises(ValueError):
        MetricValue(1, "x", "VERIFIED_EXTERNAL", "s", "u", None, None, None, "FRESH", 1.2)


def test_sha256_canonicalization():
    assert sha256_payload({"b": 2, "a": 1}) == sha256_payload({"a": 1, "b": 2})
