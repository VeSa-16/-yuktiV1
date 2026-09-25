import asyncio
from app.api.routes_analysis import generate_analysis, AnalysisRequest
from fastapi import Request
import json
import logging

logging.basicConfig(level=logging.INFO)

class MockRequest(Request):
    def __init__(self):
        self.scope = {"type": "http", "client": ("127.0.0.1", 12345), "path": "/api/analysis/generate"}
        class State: pass
        self._state = State()

async def main():
    req = AnalysisRequest(
        profile={},
        location={"district": "Solapur", "state": "MH"},
        capital={"investment_amount": 50000},
        business={"area_of_interest": "food", "suggested_idea": "cafe", "detailed_idea": "", "prior_experience": "None"}
    )
    try:
        await generate_analysis(request=MockRequest(), req=req, api_key="yukti-demo-key")
        print("Success")
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
