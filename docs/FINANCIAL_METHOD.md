# Financial Method

Financial calculations remain deterministic.

Core identity:

`facility = promoter_contribution + debt`

DPR allocation acceptance:

`sum(category_percentages) == 100%`

Core calculations:

- EMI using reducing-balance amortization
- repayment schedule
- total interest
- operating margin
- cash runway
- working capital requirement
- break-even
- DSCR when debt-service structure justifies it
- affordability
- scenario delta

Every result stores:

`input_snapshot_id + formula_version + timestamp + assumptions + scenario_id`

LLMs never perform the arithmetic.
