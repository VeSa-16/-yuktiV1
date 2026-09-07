import json
import os
from pathlib import Path
from app.schemas.provenance import DataProvenance, MetricWithProvenance

DATA_DIR = Path(__file__).parent.parent / "data"

class DataService:
    def __init__(self):
        self.datasets = {}
        self.load_all()

    def load_all(self):
        for file in DATA_DIR.glob("*.json"):
            with open(file, 'r', encoding='utf-8') as f:
                self.datasets[file.stem] = json.load(f)

    def get_dataset(self, name: str) -> list | dict:
        return self.datasets.get(name, [])
        
    def get_provenance_for_dataset(self, dataset_name: str, fallback_confidence: str = "medium") -> DataProvenance:
        sources = self.datasets.get("data_sources", [])
        for src in sources:
            if src.get("dataset") == dataset_name:
                return DataProvenance(
                    source_type=src.get("type", "open_data"),
                    source_name=src.get("name", "Unknown Source"),
                    dataset_name=dataset_name,
                    last_updated=src.get("last_updated"),
                    confidence=src.get("confidence", fallback_confidence)
                )
        # Fallback if not defined
        return DataProvenance(
            source_type="demo_data",
            source_name="Fallback Local Dataset",
            dataset_name=dataset_name,
            confidence=fallback_confidence,
            methodology="Loaded from local static files without strict source tracking."
        )

    def get_metric_with_provenance(self, value, dataset_name: str) -> MetricWithProvenance:
        return MetricWithProvenance(
            value=value,
            provenance=self.get_provenance_for_dataset(dataset_name)
        )

data_service = DataService()
