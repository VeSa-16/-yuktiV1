from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from app.ai.gemini_client import GeminiClient
from app.ai.context_builder import ContextBuilder
from app.ai.prompts.copilot import COPILOT_SYSTEM_PROMPT
from app.ai.prompts.explain import EXPLAIN_DECISION_PROMPT

router = APIRouter()
gemini = GeminiClient()
context_builder = ContextBuilder()

class ChatRequest(BaseModel):
    message: str
    location_id: str
    category_id: str
    # In a real app, these would come from the session state
    market_data: Dict[str, Any] = {}
    financial_data: Dict[str, Any] = {}
    score_data: Dict[str, Any] = {}

class ExplainRequest(BaseModel):
    question: str
    location_id: str
    category_id: str
    market_data: Dict[str, Any] = {}
    financial_data: Dict[str, Any] = {}
    score_data: Dict[str, Any] = {}

@router.post("/chat")
async def copilot_chat(req: ChatRequest):
    context = context_builder.build_copilot_context(
        req.location_id, req.category_id, req.market_data, req.financial_data, req.score_data
    )
    prompt = COPILOT_SYSTEM_PROMPT.format(context=context) + f"\\n\\nUser: {req.message}\\nCopilot:"
    
    schema = {
        "type": "object",
        "properties": {
            "reply": {"type": "string"}
        },
        "required": ["reply"]
    }
    
    response = await gemini.generate_json_async(prompt, schema=schema)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
    
    return {"reply": response.get("reply", "I am unable to process that right now.")}

@router.post("/explain")
async def copilot_explain(req: ExplainRequest):
    context = context_builder.build_copilot_context(
        req.location_id, req.category_id, req.market_data, req.financial_data, req.score_data
    )
    prompt = EXPLAIN_DECISION_PROMPT.format(context=context, question=req.question)
    
    schema = {
        "type": "object",
        "properties": {
            "explanation": {"type": "string"}
        },
        "required": ["explanation"]
    }
    
    response = await gemini.generate_json_async(prompt, schema=schema)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to get response from Gemini")
        
    return {"explanation": response.get("explanation", "I am unable to explain that right now.")}
