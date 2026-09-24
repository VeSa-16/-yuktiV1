# Confidence Specification

## YUKTI design score

A transparent weighted geometric mean is used as an engineering confidence indicator:

`C = ∏ factor_i ^ weight_i`

Default weights:

| Factor | Weight |
|---|---:|
| source authority | 0.20 |
| freshness | 0.15 |
| spatial granularity | 0.15 |
| temporal granularity | 0.10 |
| completeness | 0.10 |
| corroboration | 0.10 |
| methodology | 0.10 |
| directness | 0.10 |

All factors and weights are in [0,1]. This is **not a statistically calibrated probability**. It is an auditable YUKTI evidence-quality indicator.

## Recommended UI

Show the factors behind a confidence badge. For example:

`Confidence: 0.74 (Medium)`

Then expose:

- source authority
- data age
- spatial granularity
- coverage
- missingness
- corroboration
- methodological limitations

Never label this `74% accurate`.
