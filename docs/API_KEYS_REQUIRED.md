# API Keys Required

This pack intentionally lists only credentials that are supported by verified source documentation or existing YUKTI functionality. An empty key must never disable the offline demo.

| Service | Required for prototype? | Why | Environment variable | Public/free baseline | Production note |
|---|---|---|---|---|---|
| data.gov.in API | No for offline demo; yes for selected live resources | authenticated access to resource APIs | `DATA_GOV_API_KEY` | registered access documented by OGD | key rate/terms are dataset/service dependent |
| WorldPop v2 | No for baseline documented quota | higher API limits and production volume | `WORLDPOP_API_KEY` | no-key baseline documented; higher quota with key | request authorization for higher quota |
| Anthropic | Only if grounded AI is enabled | explanation/narration only | `ANTHROPIC_API_KEY` | account/API dependent | never send secrets or unnecessary PII |
| Map provider | Not required if existing map stack is self-hosted/OSM-derived | optional production tile/geocoding provider | `MAPBOX_ACCESS_TOKEN` / provider-specific | depends on provider | add only if the existing frontend actually uses that provider |

## Credentials explicitly NOT required by default

- OSM Overpass public instances: no universal key; limits vary by instance.
- Geofabrik downloads: no key.
- Census API: do not invent a credential requirement; verify current access controls from the official API docs before adding one.
- TRAI published reports: no key.
- NPCI published statistics: no key.
- LGD public directory pages: no universal key claim.

## Secrets policy

- Never commit `.env`.
- `.env.example` contains names only.
- Backend-only API calls keep credentials server-side.
- AI prompts must not include API keys.
- Logs must redact Authorization headers and key values.
