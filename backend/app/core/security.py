from fastapi import Security, HTTPException
from fastapi.security.api_key import APIKeyHeader
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key != "yukti-demo-key":
        raise HTTPException(
            status_code=403, detail="Could not validate API key"
        )
    return api_key
