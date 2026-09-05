"""Section 10 — the trust layer. Central place that decides confidence levels."""

def tag_confidence(data_origin: str, sample_size: int | None = None) -> str:
    if data_origin == "public_source" and (sample_size is None or sample_size >= 5):
        return "High"
    if data_origin == "public_source":
        return "Medium"
    if data_origin == "prototype_curated":
        return "Medium" if sample_size and sample_size >= 3 else "Low"
    return "Low"
