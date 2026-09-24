"""
YUKTI Real Data Ingestion Package.
Provides idempotent importers for all supplied datasets:
- LGD Administrative Master
- WorldPop 2025 1km Population Surface
- HCES 2022-23 Household Consumption Expenditure Survey
- Ahilyanagar (Ahmadnagar) 2010-11 Irrigation & Crop Area
- District Economic Census & Population Reports
- Bhuvan GIS Standards & Labour Bureau Release Calendar Metadata
"""
from .lgd_importer import import_lgd_datasets
from .worldpop_importer import import_worldpop_raster, query_catchment_population
from .hces_importer import import_hces_benchmarks, get_hces_benchmark
from .irrigation_importer import import_irrigation_dataset, get_irrigation_profile
from .economic_reports_importer import import_economic_reports, get_economic_profile
from .population_reports_importer import import_population_reports, get_population_profile
from .metadata_importers import import_bhuvan_metadata, import_labour_calendar

__all__ = [
    "import_lgd_datasets",
    "import_worldpop_raster",
    "query_catchment_population",
    "import_hces_benchmarks",
    "get_hces_benchmark",
    "import_irrigation_dataset",
    "get_irrigation_profile",
    "import_economic_reports",
    "get_economic_profile",
    "import_population_reports",
    "get_population_profile",
    "import_bhuvan_metadata",
    "import_labour_calendar",
]
