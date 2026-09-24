# Dataset Dictionary: LGD Administrative Master

## Metadata
- **Canonical ID**: `LGD_ADMIN_MASTER`
- **Source / Owner**: Local Government Directory (LGD), Ministry of Panchayati Raj, Govt of India
- **Reference Vintage**: September 2026 Registry Export
- **Classification**: `VERIFIED_EXTERNAL`
- **Usable as Direct Local Measurement**: Yes (Official administrative entity master)

## Fields & Data Dictionary
| Field | Data Type | Meaning | Provenance | Notes |
| ----- | --------- | ------- | ---------- | ----- |
| `lgd_code` | String | Official LGD unique code | `VERIFIED_EXTERNAL` | Master natural key |
| `name` | String | Official administrative name | `VERIFIED_EXTERNAL` | e.g. Ahilyanagar / Akola |
| `normalized_name` | String | Standardized lower-case lookup name | `TRANSFORMED` | Stripped punctuation & whitespace |
| `district` | String | Parent District Name | `VERIFIED_EXTERNAL` | e.g. Ahilyanagar (historical Ahmadnagar) |
| `state` | String | State Name | `VERIFIED_EXTERNAL` | Maharashtra (State Code 27) |

## Administrative Hierarchy Rules
1. `STATE` -> `DISTRICT` -> `SUBDISTRICT` -> `VILLAGE`
2. `STATE` -> `DISTRICT` -> `ULB` -> `ULB_WARD`
3. Preserves historical name mappings: `Ahmadnagar` (Historical) maps to `Ahilyanagar` (Current display).
