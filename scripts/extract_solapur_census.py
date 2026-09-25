"""
YUKTI Data Integration Script 2 (FINAL FIXED) — Census 2011 Population Extraction

Fix: Villages have TRU="Rural", not "Total". Towns have TRU="Urban". 
The script now properly handles the TRU filtering depending on the level.

Takes ~4-6 mins for 317MB file.

Usage:
    cd d:\yukti
    python scripts\extract_solapur_census.py
"""
import sys, json
from pathlib import Path

CENSUS_FILE = Path(r"C:\Users\Vedant\Desktop\sih\2011-IndiaStateDistSbDistVill-0000.xlsx")
OUTPUT_FILE = Path(r"d:\yukti\backend\data\processed\solapur_villages.json")

if not CENSUS_FILE.exists():
    print(f"ERROR: Census file not found at {CENSUS_FILE}")
    sys.exit(1)

try:
    import openpyxl
except ImportError:
    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
    import openpyxl

print("Loading Census XLSX (317MB — ~4-6 min full scan)...")
wb = openpyxl.load_workbook(CENSUS_FILE, read_only=True, data_only=True)
ws = wb["Data"]

MH_STATE = "27"
SOL_DIST = "526"

solapur_villages = {}
solapur_talukas  = {}
rows_read  = 0
sol_found  = 0

def safe_int(v):
    try: return int(float(v))
    except: return 0

for row in ws.iter_rows(min_row=2, values_only=True):
    rows_read += 1
    if rows_read % 200000 == 0:
        print(f"  {rows_read:,} rows scanned | {len(solapur_villages)} villages | {len(solapur_talukas)} talukas")

    state = str(row[0]).strip() if row[0] is not None else ""
    dist  = str(row[1]).strip() if row[1] is not None else ""

    if state != MH_STATE or dist != SOL_DIST:
        continue

    level = str(row[6]).strip().upper() if row[6] is not None else ""
    name  = str(row[7]).strip()         if row[7] is not None else ""
    tru   = str(row[8]).strip().lower() if row[8] is not None else ""

    sol_found += 1
    hh  = safe_int(row[9])
    pop = safe_int(row[10])
    mal = safe_int(row[11])
    fem = safe_int(row[12]) if len(row) > 12 else 0

    # For District/Sub-District, we want the "Total" rows
    if level in ("DISTRICT", "SUB-DISTRICT", "SUB DISTRICT", "TAHSIL", "TALUK", "TEHSIL", "C.D. BLOCK"):
        if tru in ("total", "t"):
            if level != "DISTRICT":
                solapur_talukas[name.lower()] = {
                    "name": name,
                    "population_2011": pop,
                    "households_2011": hh,
                }

    # For Villages, they are typically "Rural"
    elif level in ("VILLAGE", "VILLAGE PANCHAYAT", "PART VILLAGE", "INHABITED VILLAGE"):
        if tru in ("rural", "r", "total", "t"):
            key = name.lower().strip()
            if key not in solapur_villages:
                solapur_villages[key] = {
                    "name": name,
                    "subdistrict": str(row[2]).strip() if row[2] else "",
                    "population_2011": pop,
                    "males_2011": mal,
                    "females_2011": fem,
                    "households_2011": hh,
                    "sex_ratio": round(fem / mal * 1000) if mal > 0 else 0,
                }

    # For Towns, they are typically "Urban"
    elif level in ("TOWN", "U.T.", "STATUTORY TOWN", "CENSUS TOWN", "OUT GROWTH"):
        if tru in ("urban", "u", "total", "t"):
            key = name.lower().strip()
            if key not in solapur_villages:
                solapur_villages[key] = {
                    "name": name,
                    "subdistrict": str(row[2]).strip() if row[2] else "",
                    "population_2011": pop,
                    "males_2011": mal,
                    "females_2011": fem,
                    "households_2011": hh,
                    "sex_ratio": round(fem / mal * 1000) if mal > 0 else 0,
                    "type": "town",
                }

wb.close()

print(f"\n✅ Done! Full scan complete.")
print(f"  Total rows scanned:  {rows_read:,}")
print(f"  Solapur rows (Total): {sol_found}")
print(f"  Villages extracted:  {len(solapur_villages)}")
print(f"  Talukas found:       {[v['name'] for v in solapur_talukas.values()]}")

output = {
    "_source": "Census of India 2011 — Primary Census Abstract (PCA)",
    "_district": "Solapur, Maharashtra",
    "_state_code": MH_STATE,
    "_district_code": SOL_DIST,
    "_generated": "2026-09-25",
    "_note": "Multiply population_2011 by 1.196 for ~2026 estimate (1.2%/yr × 15 years)",
    "total_villages": len(solapur_villages),
    "talukas": solapur_talukas,
    "villages": solapur_villages,
}

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ Saved to: {OUTPUT_FILE}")
