"""
YUKTI Data Integration Script 1 — LGD Village List Extraction
Run this FIRST (it's fast, ~2 minutes).

Extracts all Solapur villages and talukas from the LGD XLS
and saves to: d:/yukti/backend/data/processed/solapur_locations.json

Usage:
    cd d:\yukti
    python scripts\extract_lgd_locations.py
"""
import zipfile, re, json, sys
from pathlib import Path

ZIP_FILE = Path(r"C:\Users\Vedant\Desktop\sih\downloadDir2026_09_24_20_46_50_654.zip")
ENTRY    = "villageofSpecificState2026:09:24:20:46:56:546.xls"
OUTPUT   = Path(r"d:\yukti\backend\data\processed\solapur_locations.json")

if not ZIP_FILE.exists():
    print(f"ERROR: Zip file not found at {ZIP_FILE}")
    sys.exit(1)

print("Reading LGD village XLS (streaming XML)...")
print("This may take 1-2 minutes for the 53MB file...")

with zipfile.ZipFile(ZIP_FILE, 'r') as z:
    data = z.read(ENTRY)

print(f"File loaded ({len(data):,} bytes). Parsing...")
text = data.decode('utf-8', errors='replace')

# Parse XML rows — split on <Row> tags
row_blocks = re.split(r'<Row\b', text)[1:]
print(f"Found {len(row_blocks):,} rows to process...")

solapur_villages = []
solapur_talukas  = {}

for i, block in enumerate(row_blocks):
    cells = re.findall(r'<Data[^>]*>(.*?)</Data>', block, re.DOTALL)
    cells = [re.sub(r'<.*?>', '', c).strip() for c in cells]

    # LGD village XLS columns (0-indexed):
    # 0: S.No | 1: District Code | 2: District Name | 3: Sub-District Code
    # 4: Sub-District Name | 5: Village Code | 6: Version | 7: Village Name (EN)
    # 8: Village Name (Local/Marathi) | 9: Village Status | 10: Census 2001 | 11: Census 2011

    if len(cells) < 8:
        continue

    dist_name  = cells[2] if len(cells) > 2 else ""
    subdist_cd = cells[3] if len(cells) > 3 else ""
    subdist    = cells[4] if len(cells) > 4 else ""
    vill_code  = cells[5] if len(cells) > 5 else ""
    vill_name  = cells[7] if len(cells) > 7 else ""   # English name
    vill_local = cells[8] if len(cells) > 8 else ""   # Marathi name
    status     = cells[9] if len(cells) > 9 else ""
    census2011 = cells[11] if len(cells) > 11 else ""

    # Filter: only Solapur district
    if "solapur" not in dist_name.lower():
        continue

    # Skip uninhabited villages
    if status.lower() in ("uninhabited", "uninhabited village"):
        continue

    # Skip blank or numeric-only names
    if not vill_name or not vill_name[0].isalpha():
        continue

    solapur_villages.append({
        "village": vill_name,
        "village_local": vill_local,
        "taluka": subdist,
        "taluka_code": subdist_cd,
        "lgd_code": vill_code,
        "census_2011_code": census2011,
    })

    if subdist and subdist not in solapur_talukas:
        solapur_talukas[subdist] = subdist_cd

print(f"\nFound {len(solapur_villages)} villages across {len(solapur_talukas)} talukas")
print(f"Talukas: {sorted(solapur_talukas.keys())}")

output = {
    "_source": "Local Government Directory (LGD) — eGov India, Ministry of Panchayati Raj",
    "_district": "Solapur, Maharashtra (State Code: 27)",
    "_generated": "2026-09-25",
    "talukas": [
        {"name": k, "lgd_code": v}
        for k, v in sorted(solapur_talukas.items())
    ],
    "total_villages": len(solapur_villages),
    "villages": sorted(solapur_villages, key=lambda x: (x["taluka"], x["village"]))
}

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"\n✅ Saved to: {OUTPUT}")
print("Next step: run extract_solapur_census.py for population data")
