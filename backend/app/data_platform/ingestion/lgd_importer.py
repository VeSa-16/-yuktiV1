from __future__ import annotations

import os
import zipfile
import xml.etree.ElementTree as ET
from typing import Any, Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

DEFAULT_DOWNLOADS_DIR = r"C:\Users\Vedant\Desktop\sih"

def parse_xml_spreadsheet_bytes(file_bytes: bytes) -> List[List[str]]:
    """Parse XML Spreadsheet 2003 rows cleanly."""
    try:
        tree = ET.fromstring(file_bytes)
    except Exception as e:
        logger.error(f"[LGD] Error parsing XML Spreadsheet: {e}")
        return []

    rows_data: List[List[str]] = []
    for sheet in tree.findall('.//{urn:schemas-microsoft-com:office:spreadsheet}Worksheet'):
        table = sheet.find('{urn:schemas-microsoft-com:office:spreadsheet}Table')
        if table is None:
            continue
        for row in table.findall('{urn:schemas-microsoft-com:office:spreadsheet}Row'):
            row_cells: List[str] = []
            for cell in row.findall('{urn:schemas-microsoft-com:office:spreadsheet}Cell'):
                data = cell.find('{urn:schemas-microsoft-com:office:spreadsheet}Data')
                val = data.text.strip() if data is not None and data.text else ""
                row_cells.append(val)
            if any(row_cells):
                rows_data.append(row_cells)
    return rows_data


class LGDRegistry:
    """In-memory & persistent cache of LGD administrative entities."""

    def __init__(self) -> None:
        self.subdistricts: Dict[str, Dict[str, Any]] = {}
        self.villages: Dict[str, Dict[str, Any]] = {}
        self.gp_mappings: List[Dict[str, Any]] = []

    def load_from_zips(self, downloads_dir: str = DEFAULT_DOWNLOADS_DIR) -> Dict[str, int]:
        zip1 = os.path.join(downloads_dir, "downloadDir2026_09_24_20_46_50_654.zip")
        zip2 = os.path.join(downloads_dir, "downloadDir2026_09_24_20_49_00_219.zip")

        subdistrict_count = 0
        village_count = 0

        for zpath in [zip1, zip2]:
            if not os.path.exists(zpath):
                continue
            try:
                with zipfile.ZipFile(zpath, "r") as z:
                    for name in z.namelist():
                        content = z.read(name)
                        rows = parse_xml_spreadsheet_bytes(content)
                        if not rows:
                            continue

                        # Header detection
                        header_idx = -1
                        for idx, r in enumerate(rows[:10]):
                            if any("Subdistrict" in cell or "Village" in cell for cell in r):
                                header_idx = idx
                                break

                        if header_idx != -1:
                            headers = [h.strip() for h in rows[header_idx]]
                            data_rows = rows[header_idx + 1 :]

                            if "Subdistrict Code" in headers:
                                district_col = headers.index("District Name") if "District Name" in headers else 2
                                subdist_code_col = headers.index("Subdistrict Code") if "Subdistrict Code" in headers else 3
                                subdist_name_col = headers.index("Subdistrict Name  ") if "Subdistrict Name  " in headers else 5

                                for dr in data_rows:
                                    if len(dr) > max(district_col, subdist_code_col, subdist_name_col):
                                        scode = dr[subdist_code_col]
                                        sname = dr[subdist_name_col]
                                        dname = dr[district_col]
                                        if scode and sname:
                                            self.subdistricts[scode] = {
                                                "lgd_code": scode,
                                                "name": sname,
                                                "district": dname,
                                                "state": "Maharashtra",
                                                "state_code": "27",
                                                "provenance_class": "VERIFIED_EXTERNAL",
                                                "source_id": "LGD_ADMIN_MASTER",
                                            }
                                            subdistrict_count += 1

                            elif "Village Code" in headers or any("Village" in h for h in headers):
                                for dr in data_rows:
                                    if len(dr) >= 5:
                                        vcode = dr[3] if len(dr) > 3 else ""
                                        vname = dr[5] if len(dr) > 5 else ""
                                        dname = dr[2] if len(dr) > 2 else ""
                                        if vcode and vname:
                                            self.villages[vcode] = {
                                                "lgd_code": vcode,
                                                "name": vname,
                                                "district": dname,
                                                "state": "Maharashtra",
                                                "state_code": "27",
                                                "provenance_class": "VERIFIED_EXTERNAL",
                                                "source_id": "LGD_ADMIN_MASTER",
                                            }
                                            village_count += 1
            except Exception as exc:
                logger.error(f"[LGD] Error reading {zpath}: {exc}")

        # Fallback if no data was found
        if subdistrict_count == 0 and village_count == 0:
            logger.warning("[LGD] Zip files not found or empty. Using fallback mock data for testing.")
            fallback_subdistricts = [
                {"lgd_code": "LGD_SD_1", "name": "Akola", "district": "Ahilyanagar"},
                {"lgd_code": "LGD_SD_2", "name": "Sangamner", "district": "Ahilyanagar"},
                {"lgd_code": "LGD_SD_3", "name": "North Solapur", "district": "Solapur"},
                {"lgd_code": "LGD_SD_4", "name": "Pune City", "district": "Pune"},
            ]
            for sd in fallback_subdistricts:
                self.subdistricts[sd["lgd_code"]] = {
                    **sd,
                    "state": "Maharashtra",
                    "state_code": "27",
                    "provenance_class": "FALLBACK_MOCK",
                    "source_id": "LGD_ADMIN_MASTER",
                }
            
            fallback_villages = [
                {"lgd_code": "LGD_V_1", "name": "Local Area", "district": "Ahilyanagar"},
                {"lgd_code": "LGD_V_2", "name": "Kondi", "district": "Solapur"},
                {"lgd_code": "LGD_V_3", "name": "Khed", "district": "Solapur"},
                {"lgd_code": "LGD_V_4", "name": "Ralegan Siddhi", "district": "Ahilyanagar"},
            ]
            for v in fallback_villages:
                self.villages[v["lgd_code"]] = {
                    **v,
                    "state": "Maharashtra",
                    "state_code": "27",
                    "provenance_class": "FALLBACK_MOCK",
                    "source_id": "LGD_ADMIN_MASTER",
                }

        return {"subdistricts": len(self.subdistricts), "villages": len(self.villages)}

    def resolve_location(self, query_name: str, district: Optional[str] = None) -> Optional[Dict[str, Any]]:
        norm_query = query_name.lower().strip()
        norm_dist = district.lower().strip() if district else None

        # Check subdistricts first
        for sd in self.subdistricts.values():
            if sd["name"].lower().strip() == norm_query:
                if not norm_dist or sd["district"].lower().strip() == norm_dist:
                    return {**sd, "entity_type": "SUBDISTRICT", "match_confidence": 1.0}

        # Check villages
        for v in self.villages.values():
            if v["name"].lower().strip() == norm_query:
                if not norm_dist or v["district"].lower().strip() == norm_dist:
                    return {**v, "entity_type": "VILLAGE", "match_confidence": 1.0}

        # Fallback partial match
        for sd in self.subdistricts.values():
            if norm_query in sd["name"].lower():
                return {**sd, "entity_type": "SUBDISTRICT", "match_confidence": 0.8, "match_type": "PARTIAL"}

        return None


lgd_registry = LGDRegistry()

def import_lgd_datasets(downloads_dir: str = DEFAULT_DOWNLOADS_DIR) -> Dict[str, Any]:
    counts = lgd_registry.load_from_zips(downloads_dir)
    return {
        "status": "SUCCESS",
        "dataset_id": "LGD_ADMIN_MASTER",
        "subdistricts": list(lgd_registry.subdistricts.values()),
        "villages": list(lgd_registry.villages.values()),
        "counts": counts,
    }

