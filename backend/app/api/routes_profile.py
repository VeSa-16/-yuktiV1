"""POST /profile — create user + resolve location."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session as DBSession
from app.schemas.profile import ProfileRequest, ProfileResponse
from app.core.db import get_db
from app.models import User, Location
from app.models.core import uid
from app.engines.location_service import resolve_location, get_location_metadata

router = APIRouter()


@router.post("/profile", response_model=ProfileResponse)
def create_profile(req: ProfileRequest, db: DBSession = Depends(get_db)):
    # Resolve location
    location_id = resolve_location(req.location_input)
    if not location_id:
        raise HTTPException(status_code=400, detail="Could not resolve location. Try 'Solapur' or 'Remote'.")

    # Verify location exists in DB
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found in database.")

    # Create user
    user = User(id=uid(), name=req.name, language_pref=req.language)
    db.add(user)
    db.commit()

    meta = get_location_metadata(location_id)
    return ProfileResponse(
        user_id=user.id,
        location_id=location_id,
        location_name=f"{location.district}, {location.state}",
        state=location.state,
        lat=meta.get("lat", location.lat),
        lng=meta.get("lng", location.lng),
        data_richness=meta.get("data_richness", location.data_richness),
    )
