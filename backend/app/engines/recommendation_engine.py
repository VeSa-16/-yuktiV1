"""
Section 12/13 — hard gates + weighted scoring + verdict banding.
Weights below are [PROTOTYPE-ASSUMPTION] — tune against your own rubric,
but keep them as named constants, never inline magic numbers.
"""
from dataclasses import dataclass

WEIGHTS = {
    "financial_viability": 0.30,
    "repayment_capacity": 0.25,
    "market_opportunity": 0.20,
    "capital_efficiency": 0.15,
    "risk_exposure": 0.10,
}

DSCR_HARD_GATE = 1.0   # below this, verdict cannot be GO regardless of score


@dataclass
class ScoreBreakdown:
    dimensions: dict
    raw_score: float
    confidence_multiplier: float
    final_score: float
    verdict: str


def band_verdict(score: float, dscr: float) -> str:
    if dscr < DSCR_HARD_GATE:
        return "NOT_RECOMMENDED"
    if score >= 80:
        return "GO"
    if score >= 60:
        return "CAUTION"
    if score >= 40:
        return "ALTERNATIVE"
    return "NOT_RECOMMENDED"


def compute_yukti_score(dimension_scores: dict, confidence_multiplier: float, dscr: float) -> ScoreBreakdown:
    """
    dimension_scores: dict of {dimension_name: 0-100 value}, must match WEIGHTS keys.
    confidence_multiplier: 0.0-1.0, derived from the aggregate confidence of inputs
      used (Section 10) — a High-confidence analysis should not be penalised,
      a Low-confidence one should visibly pull the score down or trigger caveats.
    """
    raw = sum(dimension_scores[k] * WEIGHTS[k] for k in WEIGHTS)
    final = round(raw * confidence_multiplier, 1)
    verdict = band_verdict(final, dscr)
    return ScoreBreakdown(
        dimensions=dimension_scores,
        raw_score=round(raw, 1),
        confidence_multiplier=confidence_multiplier,
        final_score=final,
        verdict=verdict,
    )
