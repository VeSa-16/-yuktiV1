# What-If Method

A scenario stores only deltas from the baseline plus any user overrides.

Examples:

- revenue: -5/-10/-15/-20%
- operating cost: +5/+10/+20%
- input price increase
- production decrease
- loan rate change
- tenure change
- subsidy unavailable
- working-capital increase

Output:

`baseline, scenario, delta, cash impact, DSCR impact, break-even impact, affordability impact, risk shift, confidence`

Scenario runs are immutable so that a later model change does not rewrite historical decisions.
