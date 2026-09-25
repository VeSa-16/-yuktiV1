"""
FastAPI router for the RAG-powered Scheme Advisor / Copilot.

Wire this into your existing app in backend/app/main.py:

    from rag.router import router as rag_router
    app.include_router(rag_router, prefix="/api/copilot", tags=["copilot"])

Then POST to /api/copilot/ask with {"query": "...", "language": "en"}.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .retriever import retrieve, build_context_block

# --- Adjust this import to match your actual gemini_client.py -------------
# Assumed to expose a function like: generate(prompt: str) -> str
# If your function is named differently, just change this one line.
from app.ai.gemini_client import generate as gemini_generate
# ---------------------------------------------------------------------------

router = APIRouter()


class AskRequest(BaseModel):
    query: str
    language: str = "en"   # "en" or "hi" — used only to steer the reply language


class AskResponse(BaseModel):
    answer: str
    sources: list
    grounded: bool


SYSTEM_INSTRUCTIONS = {
    "en": (
        "You are YuktiFi's Scheme Advisor. Answer ONLY using the CONTEXT "
        "provided below, which comes from official scheme/compliance PDFs. "
        "If the context does not contain the answer, say clearly that you "
        "don't have that information in the available documents — do NOT "
        "guess or use outside knowledge. Cite the source document and page "
        "number for every claim. Answer in English."
    ),
    "hi": (
        "आप YuktiFi के Scheme Advisor हैं। नीचे दिए गए CONTEXT का उपयोग करके ही उत्तर दें, "
        "जो आधिकारिक योजना/अनुपालन PDF से लिया गया है। अगर उत्तर CONTEXT में नहीं है, "
        "तो स्पष्ट रूप से बताएं कि यह जानकारी उपलब्ध दस्तावेज़ों में नहीं है — अनुमान न लगाएं। "
        "हर दावे के लिए स्रोत दस्तावेज़ और पृष्ठ संख्या बताएं। उत्तर हिंदी में दें।"
    ),
}


def build_prompt(query: str, context_block: str, language: str) -> str:
    instructions = SYSTEM_INSTRUCTIONS.get(language, SYSTEM_INSTRUCTIONS["en"])
    return (
        f"{instructions}\n\n"
        f"CONTEXT:\n{context_block}\n\n"
        f"QUESTION: {query}\n\n"
        f"ANSWER:"
    )


@router.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    hits = retrieve(req.query, top_k=4)

    if not hits:
        # No relevant chunks found -> don't call the LLM blind, avoid hallucination
        fallback = {
            "en": "I couldn't find this in the available scheme documents. Please rephrase or check with an official source.",
            "hi": "यह जानकारी उपलब्ध दस्तावेज़ों में नहीं मिली। कृपया प्रश्न दोबारा लिखें या आधिकारिक स्रोत से जांचें।",
        }
        return AskResponse(
            answer=fallback.get(req.language, fallback["en"]),
            sources=[],
            grounded=False,
        )

    context_block = build_context_block(hits)
    prompt = build_prompt(req.query, context_block, req.language)

    answer_text = gemini_generate(prompt)

    sources = [
        {"source": h["source"], "page": h["page"]} for h in hits
    ]

    return AskResponse(answer=answer_text, sources=sources, grounded=True)
