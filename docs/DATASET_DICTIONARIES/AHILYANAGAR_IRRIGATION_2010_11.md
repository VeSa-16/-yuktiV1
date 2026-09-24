# Dataset Dictionary: Ahilyanagar (Ahmadnagar) 2010-11 Irrigation & Crop Area

## Metadata
- **Canonical ID**: `AHILYANAGAR_IRRIGATION_2010_11`
- **Source / Owner**: District Irrigation Department / Dept of Agriculture, Govt of Maharashtra
- **Reference Period**: 2010-11
- **Classification**: `HISTORICAL` / `SOURCE_DERIVED`
- **Usable as Direct Local Measurement**: Historical Baseline ONLY (Not current cultivation)

## Fields & Data Dictionary
| Field | Data Type | Unit | Meaning | Provenance | Notes |
| ----- | --------- | ---- | ------- | ---------- | ----- |
| `taluka` | String | Categorical | Taluka / Sub-district name | `SOURCE_DERIVED` | e.g. Akola, Sangamner, Rahuri |
| `wheat_crop_area` | Float | Hectares | Area under Wheat cultivation | `HISTORICAL` | 2010-11 baseline |
| `sugarcane_crop_area` | Float | Hectares | Area under Sugarcane cultivation | `HISTORICAL` | 2010-11 baseline |
| `total_cultivated_area` | Float | Hectares | Total cultivated crop area | `HISTORICAL` | 2010-11 baseline |
| `total_irrigated_area` | Float | Hectares | Total irrigated area | `HISTORICAL` | 2010-11 baseline |
| `irrigated_share_pct` | Float | Percent (%) | Irrigated area share of total cultivated area | `CALCULATED` | Long-term agricultural structure signal |

## Usage Guidelines
1. UI must explicitly display warning: `Historical crop/irrigation baseline (2010-11). Do not interpret as current cultivated area.`
