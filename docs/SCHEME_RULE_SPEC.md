# Scheme Rule Specification

Each scheme is a versioned ruleset, never just a page of UI text.

```json
{
  "scheme_id": "PMEGP",
  "version": "2023-12-07",
  "source_url": "https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf",
  "effective_date": null,
  "last_verified": "2026-09-24",
  "eligibility_rules": [],
  "financial_rules": [],
  "geography_rules": [],
  "beneficiary_rules": [],
  "document_rules": [],
  "exclusions": [],
  "application_url": null,
  "provenance": "VERIFIED_EXTERNAL"
}
```

## Output states

- `LIKELY_MATCH`
- `MEETS_CHECKED_CRITERIA`
- `MISSING_INFORMATION`
- `APPEARS_INELIGIBLE`
- `AUTHORITY_CONFIRMATION_REQUIRED`

## Guardrails

Do not guarantee sanction. Distinguish subsidy from guarantee support. CGTMSE explicitly states that it does not provide financial assistance; it provides guarantee cover to eligible lending-institution credit facilities. 
