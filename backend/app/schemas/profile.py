from pydantic import BaseModel
from typing import Optional


class ProfileRequest(BaseModel):
    name: str
    language: str = "en"
    location_input: str  # e.g. "Solapur" — resolved by location_service


class ProfileResponse(BaseModel):
    user_id: str
    location_id: str
    location_name: str
    state: str
    lat: float
    lng: float
    data_richness: str
