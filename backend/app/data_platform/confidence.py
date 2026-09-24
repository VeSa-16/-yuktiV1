from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ConfidenceFactors:
    source_authority: float
    freshness: float
    spatial_granularity: float
    temporal_granularity: float
    completeness: float
    corroboration: float
    methodology: float
    directness: float

    def validate(self) -> None:
        for name, value in self.__dict__.items():
            if not 0.0 <= value <= 1.0:
                raise ValueError(f"{name} must be in [0, 1]")


def confidence_score(
    factors: ConfidenceFactors,
    *,
    weights: dict[str, float] | None = None,
) -> float:
    """Transparent weighted geometric mean; weights must sum to 1."""
    factors.validate()
    default = {
        "source_authority": 0.20,
        "freshness": 0.15,
        "spatial_granularity": 0.15,
        "temporal_granularity": 0.10,
        "completeness": 0.10,
        "corroboration": 0.10,
        "methodology": 0.10,
        "directness": 0.10,
    }
    weights = weights or default
    if set(weights) != set(default):
        raise ValueError("weights must cover all confidence factors")
    total = sum(weights.values())
    if abs(total - 1.0) > 1e-9 or any(v < 0 for v in weights.values()):
        raise ValueError("weights must be non-negative and sum to 1")
    score = 1.0
    for name, weight in weights.items():
        score *= max(0.0, getattr(factors, name)) ** weight
    return round(score, 4)
