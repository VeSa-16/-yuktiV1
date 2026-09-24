# Data Gaps and Limitations

## Confirmed limitations

- Census API is historical (published 2001/2011 tables); it is not current population measurement.
- WorldPop is modelled spatial population data, not a census.
- OSM is an observed/mapped database, not a complete business census.
- Nominatim public service has strict usage restrictions and is inappropriate for systematic periodic bulk geocoding.
- Aggregate TRAI/NPCI statistics must not be downscaled to village-level behaviour without evidence.
- data.gov.in is a catalogue of datasets with mixed API/download availability; dataset APIs must be verified resource-by-resource.
- Scheme rules can change; the scheme engine needs versioned evidence and verification dates.
- Agmarknet access path has not been verified in this execution and must remain `UNVERIFIED`.
- No real labelled dataset exists in this execution that would justify a calibrated ML probability for business success.

## User action when data is missing

The UI should offer actionable replacements:

- local selling price
- observed monthly customer count
- competitor names/counts from field survey
- actual rent quote
- actual supplier quotes
- promoter contribution
- lender quote / tentative rate

These values should become `USER_PROVIDED` or `ASSUMPTION`, never silently `VERIFIED_EXTERNAL`.
