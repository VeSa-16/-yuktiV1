"""
Pure rule-table lookup against NSFDC-verified schemes (Section 16.1).
This module NEVER calls an LLM and NEVER improvises a scheme.
"""
from dataclasses import dataclass
from typing import Optional

MICRO_FINANCE_CEILING = 140_000
TERM_LOAN_CEILING = 5_000_000        # ₹50 lakh, matches Section 17.1's stated max
MICRO_FINANCE_MAX_LOAN = 125_000
TERM_LOAN_MAX_LOAN = 4_500_000       # ₹45 lakh

SCHEMES = {
    "Micro Credit Finance": {
        "rate": 6.5, "tenure_years": 3, "moratorium_months": 3,
        "max_loan": MICRO_FINANCE_MAX_LOAN,
        "source_url": "https://nsfdc.nic.in",  # TODO: pin exact scheme page URL
    },
    "Term Loan": {
        "rate": 8.0, "tenure_years": 7, "moratorium_months": 6,
        "max_loan": TERM_LOAN_MAX_LOAN,
        "source_url": "https://nsfdc.nic.in",
    },
}


@dataclass
class SchemeMatch:
    matched: bool
    scheme_name: Optional[str]
    max_loan: Optional[float]
    rate: Optional[float]
    tenure_years: Optional[int]
    moratorium_months: Optional[int]
    rejected_alternative: Optional[str]
    explanation: str
    source_url: Optional[str]


def match_scheme(project_cost: float) -> SchemeMatch:
    if project_cost <= MICRO_FINANCE_CEILING:
        s = SCHEMES["Micro Credit Finance"]
        return SchemeMatch(
            matched=True,
            scheme_name="Micro Credit Finance",
            max_loan=min(project_cost * 0.90, s["max_loan"]),
            rate=s["rate"], tenure_years=s["tenure_years"],
            moratorium_months=s["moratorium_months"],
            rejected_alternative="Term Loan (project cost below its band)",
            explanation=(
                f"Your project cost of ₹{project_cost:,.0f} is at or below the "
                f"₹{MICRO_FINANCE_CEILING:,.0f} ceiling, so you're routed to Micro Credit Finance."
            ),
            source_url=s["source_url"],
        )
    elif MICRO_FINANCE_CEILING < project_cost <= TERM_LOAN_CEILING:
        s = SCHEMES["Term Loan"]
        return SchemeMatch(
            matched=True,
            scheme_name="Term Loan",
            max_loan=min(project_cost * 0.90, s["max_loan"]),
            rate=s["rate"], tenure_years=s["tenure_years"],
            moratorium_months=s["moratorium_months"],
            rejected_alternative="Micro Credit Finance (project cost exceeds its ceiling)",
            explanation=(
                f"Your project cost of ₹{project_cost:,.0f} falls in the "
                f"₹{MICRO_FINANCE_CEILING:,.0f}–₹{TERM_LOAN_CEILING:,.0f} band, "
                f"so you're routed to the Term Loan scheme rather than Micro Credit Finance."
            ),
            source_url=s["source_url"],
        )
    else:
        return SchemeMatch(
            matched=False, scheme_name=None, max_loan=None, rate=None,
            tenure_years=None, moratorium_months=None, rejected_alternative=None,
            explanation=(
                f"Based on your available margin capital, the resulting project cost of "
                f"₹{project_cost:,.0f} exceeds the ₹{TERM_LOAN_CEILING:,.0f} ceiling modelled "
                "in this prototype's financing schemes. This does not necessarily mean the "
                "business is unfinanceable — it means it likely requires a different financing "
                "instrument (larger MSME term-loan products or bank co-financing) not modelled "
                "here. Consider resizing the project or consulting your nearest bank/State "
                "Channelizing Agency about larger-ticket options."
            ),
            source_url=None,
        )
