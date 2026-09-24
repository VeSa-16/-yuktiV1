"""
YUKTI Real Data Evidence API Router.
Exposes provenance-backed local evidence signals, dataset benchmarks, and fused decision context.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Query, HTTPException

from app.data_platform.fusion import generate_evidence_bundle, resolve_lgd_location
from app.data_platform.ingestion import (
    query_catchment_population,
    get_hces_benchmark,
    get_irrigation_profile,
    get_economic_profile,
    get_population_profile,
    import_bhuvan_metadata,
    import_labour_calendar,
)

router = APIRouter(prefix="/api/v1/evidence", tags=["evidence"])


@router.get("/fusion", summary="Get Fused Real Data Evidence Bundle")
def get_fused_evidence(
    lat: float = Query(17.6599, description="Latitude"),
    lon: float = Query(75.9064, description="Longitude"),
    state: str = Query("Maharashtra", description="State name"),
    district: str = Query("Ahilyanagar", description="District name"),
    subdistrict: Optional[str] = Query("Ahilyanagar", description="Subdistrict/Taluka name"),
    village: Optional[str] = Query(None, description="Village/GP name"),
    sector: str = Query("RURAL", description="RURAL or URBAN sector"),
    radius_km: float = Query(10.0, description="Catchment radius in km"),
) -> Dict[str, Any]:
    """
    Returns unified evidence bundle combining LGD admin hierarchy, WorldPop 2025 catchment,
    HCES 2022-23 benchmarks, historical irrigation, and economic profiles with full provenance.
    """
    try:
        bundle = generate_evidence_bundle(
            lat=lat,
            lon=lon,
            state=state,
            district=district,
            subdistrict=subdistrict,
            village=village,
            sector=sector,
            catchment_radius_km=radius_km,
        )
        return bundle
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error generating evidence bundle: {str(exc)}")


@router.get("/catchment-population", summary="Get WorldPop 2025 Catchment Population")
def get_catchment(
    lat: float = Query(17.6599),
    lon: float = Query(75.9064),
    radius_km: float = Query(10.0),
) -> Dict[str, Any]:
    """Queries WorldPop 2025 population surface for geodesic catchment radius."""
    try:
        return query_catchment_population(lat=lat, lon=lon, radius_km=radius_km)
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))


@router.get("/hces-benchmark", summary="Get HCES 2022-23 Expenditure Benchmark")
def get_hces(
    state: str = Query("Maharashtra"),
    sector: str = Query("RURAL"),
    variant: str = Query("WITHOUT_IMPUTATION"),
) -> Dict[str, Any]:
    """Returns official NSS Report No. 591 MPCE benchmark."""
    return get_hces_benchmark(state=state, sector=sector, imputation_variant=variant)


@router.get("/irrigation-profile", summary="Get Historical Crop & Irrigation Profile")
def get_irrigation(
    taluka: str = Query("Akola"),
) -> Dict[str, Any]:
    """Returns 2010-11 historical crop & irrigation area profile."""
    return get_irrigation_profile(taluka_name=taluka)


@router.get("/lgd-resolve", summary="Resolve Administrative Location via LGD Master")
def get_lgd_resolve(
    lat: float = Query(17.6599),
    lon: float = Query(75.9064),
    state: str = Query("Maharashtra"),
    district: str = Query("Ahilyanagar"),
    subdistrict: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
) -> Dict[str, Any]:
    """Resolves LGD codes, entity hierarchy, and historical name aliases."""
    return resolve_lgd_location(lat=lat, lon=lon, state=state, district=district, subdistrict=subdistrict, village=village)


@router.get("/standards-and-metadata", summary="Get Bhuvan Standards & Labour Bureau Calendar Metadata")
def get_metadata() -> Dict[str, Any]:
    """Returns Bhuvan GIS reference standards and Labour Bureau release calendar metadata."""
    return {
        "bhuvan_standards": import_bhuvan_metadata(),
        "labour_calendar": import_labour_calendar(),
    }
