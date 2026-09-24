# Dataset Dictionary: WorldPop 2025 1km Population Surface

## Metadata
- **Canonical ID**: `WORLDPOP_INDIA_2025_1KM`
- **Source / Owner**: WorldPop / University of Southampton (R2025A Unconstrained Surface)
- **Reference Period**: 2025
- **Resolution**: 30 arc-seconds (~1km at equator)
- **CRS**: EPSG:4326 (WGS84)
- **Classification**: `MODEL_PREDICTION`
- **Usable as Direct Local Measurement**: Modelled grid estimate (Not Census door-to-door count)

## Fields & Data Dictionary
| Field | Data Type | Unit | Meaning | Provenance | Notes |
| ----- | --------- | ---- | ------- | ---------- | ----- |
| `catchment_radius_km` | Float | km | Geodesic catchment query radius | `CALCULATED` | e.g. 5.0, 10.0, 15.0 km |
| `catchment_area_sq_km` | Float | sq km | Geodesic circle area ($\pi r^2$) | `CALCULATED` | Geodesic area |
| `total_population` | Integer | Persons | Modelled grid catchment population | `MODEL_PREDICTION` | Aggregated grid surface estimate |
| `population_density_per_sq_km` | Float | Persons / sq km | Spatial density benchmark | `MODEL_PREDICTION` | Regional density surface |

## Usage Guidelines
1. Always tag output as `Modelled population estimate`.
2. Do NOT present as official Census enumeration count.
