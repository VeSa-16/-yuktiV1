from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.ai.gemini_client import GeminiClient
from app.ai.context_builder import ContextBuilder
from app.ai.prompts.business_plan import BUSINESS_PLAN_SYSTEM_PROMPT
from app.schemas.business_plan import BusinessPlan

router = APIRouter()
gemini = GeminiClient()
context_builder = ContextBuilder()

class BusinessPlanRequest(BaseModel):
    location: str
    category: str
    market_data: Dict[str, Any] = {}
    financial_data: Dict[str, Any] = {}
    risk_data: Dict[str, Any] = {}

@router.post("/generate", response_model=BusinessPlan)
async def generate_business_plan(req: BusinessPlanRequest):
    context = context_builder.build_comprehensive_context(
        req.location, req.category, req.market_data, req.financial_data, req.risk_data
    )
    prompt = BUSINESS_PLAN_SYSTEM_PROMPT.format(context=context)
    
    # We use the generated Pydantic schema dictionary as the Gemini JSON schema
    # Note: In production, Gemini's response_schema parameter has specific requirements,
    # but strictly typed Pydantic output validation ensures safety.
    response = await gemini.generate_json_async(prompt)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to generate business plan")
        
    try:
        # Pydantic validation
        business_plan = BusinessPlan(**response)
        return business_plan
    except Exception as e:
        # If Gemini hallucinated bad structure, we reject it
        raise HTTPException(status_code=422, detail=f"AI returned invalid schema: {str(e)}")
