# YUKTI — Real Dataset Forensics & Canonical Registry

| Artifact Filename | File Type | Source / Owner | Canonical Dataset ID | Coverage | Geography | Time Horizon | Unit | Records / Size | Duplicate? | Usability & Role |
|---|---|---|---|---|---|---|---|---:|:---:|---|
| `Report_591_HCES_2022-23New.pdf` | PDF | MoSPI / NSSO | `HCES_2022_23_REPORT_591` | National / State aggregate MPCE | India / States / UTs | 2022–2023 | INR / capita / month | 7.52 MB (NSS Rep. 591) | No | **Canonical**: State/Rural/Urban household consumption benchmarks |
| `Factsheet_HCES_2022-23.pdf` | PDF | MoSPI / NSSO | `HCES_2022_23_FACTSHEET` | Household MPCE summary factsheet | All-India / Rural / Urban | 2022–2023 | INR / capita / month | 5.91 MB | No | **Canonical**: Summary MPCE statistical factsheet |
| `4_Bhuvan_Data_Content_And_Map_Standards.pdf` | PDF | ISRO / NRSC | `BHUVAN_GEOSPATIAL_STANDARDS_2015` | Bhuvan GIS metadata & map standards | India National GIS | 2015 | Reference Specs | 880 KB | No | **Reference Only**: Spatial metadata & map standards |
| `4_Bhuvan_Data_Content_And_Map_Standards (1).pdf` | PDF | ISRO / NRSC | `BHUVAN_GEOSPATIAL_STANDARDS_2015` | Bhuvan GIS metadata & map standards | India National GIS | 2015 | Reference Specs | 880 KB | **Yes** (Identical SHA-256) | **Duplicate**: Ignored in favor of canonical file |
| `ind_pop_2025_CN_1km_R2025A_UA_v1.tif` | GeoTIFF | WorldPop | `WORLDPOP_INDIA_2025_1KM` | Spatial population surface | India (1km resolution) | 2025 | People / pixel | 16.3 MB | No | **Canonical**: Modelled catchment population raster |
| `ind_pop_2025_CN_1km_R2025A_UA_v1 (1).tif` | GeoTIFF | WorldPop | `WORLDPOP_INDIA_2025_1KM` | Spatial population surface | India (1km resolution) | 2025 | People / pixel | 16.3 MB | **Yes** (Identical SHA-256) | **Duplicate**: Ignored in favor of canonical file |
| `2010-11_Irrigation_Area_Ahilyanagar (1).zip` | ZIP/XML | MoA&FW / Gov of India | `AHILYANAGAR_IRRIGATION_2010_11` | Irrigated & crop area | Ahilyanagar (Ahmadnagar) | 2010–2011 | Hectares / Acres | 4.5 KB (XML inside) | No | **Canonical**: Historical agricultural baseline signal |
| `ecnomicPDFAndXLSReports.xls` | XLS | MoSPI / State DES | `ECONOMIC_REPORT_COLLECTION` | State / District economic indicators | State / District | 2020–2023 | Macro metrics | 6.14 KB | No | **Canonical**: District macro/economic context |
| `adhocPopulationReports.xls` | XLS | Census / Registrar General | `POPULATION_REPORT_COLLECTION` | Demographics & census tables | State / District / Village | Historical | Count | 12.8 KB | No | **Canonical**: Historical population reference table |
| `downloadDir2026_09_24_20_46_50_654.zip` | ZIP/XLS | LGD (MoPR) | `LGD_ADMIN_MASTER_PART1` | Sub-district & Village LGD master | State / District / Sub-district | 2026 | Administrative Code | 1.61 MB | No | **Canonical**: Administrative entity hierarchy |
| `downloadDir2026_09_24_20_49_00_219.zip` | ZIP/XLS | LGD (MoPR) | `LGD_ADMIN_MASTER_PART2` | Sub-district, Village, ULB, Wards, GP mapping | State / District / ULB / GP | 2026 | Administrative Code | 3.52 MB | No | **Canonical**: Complete LGD administrative hierarchy & GP mapping |
| `WRIpdf-517a7d2e45e78b3958e752dcd189e6b8.pdf` | PDF | Labour Bureau (MoLE) | `LABOUR_BUREAU_RELEASE_CALENDAR` | Rural wage rate release calendar | India | Scheduled | Schedule Metadata | 93.6 KB | No | **Metadata Only**: Ingestion schedule metadata (Not wage data) |

---

## Cryptographic Artifact Hashes (SHA-256)

```text
e17d43c092043b466711b2bfc2f8e0f42af6dcddd1da57897db91845747fecaf  Report_591_HCES_2022-23New.pdf
2993c572f87f8b58c9c4ddc075431b2d2f2593aef00914f136d11ac434e3e9fc  Factsheet_HCES_2022-23.pdf
b967e6303e179d7622d38bf5bd20d7de24ad23264cbbfffc6d6ff19949a67691  4_Bhuvan_Data_Content_And_Map_Standards.pdf
e188723030087fb8e90e1741199bd476a181c00b046fab7dd8e8358adb136b64  ind_pop_2025_CN_1km_R2025A_UA_v1.tif
e8424f01d3e5755d2e959194546b4edfcd34e63281995b30d21cb0058ab963f0  2010-11_Irrigation_Area_Ahilyanagar (1).zip
25452177f1bf518bce03d3b9162c96c905171c5741e3936b6e147b13405c4a2f  ecnomicPDFAndXLSReports.xls
8f16972a8554ae1ca62a738dd8e30d7c22e4d68c5b7d6d4d726ddbcca47cc9ad  adhocPopulationReports.xls
c0e1cad8b5e18346d661c395c566573ca6d77267d232a0adfa9df3acb5be8ea6  downloadDir2026_09_24_20_46_50_654.zip
9ab07bbb8418ce0684ac7a9c632c89193eea9e1e76103909f3e851b250170f93  downloadDir2026_09_24_20_49_00_219.zip
52224bd8faf72ff15257753d0b6b71a0991dd222327ab675bfe7ca7826adbd53  WRIpdf-517a7d2e45e78b3958e752dcd189e6b8.pdf
```
