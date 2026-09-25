# YuktiFi RAG — Setup

## 1. Install
```bash
pip install -r requirements-rag.txt
```
(First run will download the `paraphrase-multilingual-MiniLM-L12-v2` model, ~470MB — one-time, cached locally after.)

## 2. Drop your files in
Copy this whole `rag/` folder into your `backend/app/` directory (next to `main.py` and `gemini_client.py`), so the relative imports (`..gemini_client`) resolve correctly.

Put your 10-20 scheme PDFs into `rag/scheme_pdfs/`.

## 3. Ingest (run once, or whenever PDFs change)
```bash
python -m rag.ingest
```
This creates `rag/chroma_store/` — a folder of local SQLite files. No server, no Docker, no internet needed for this step.

## 4. Fix the Gemini import
Open `rag/router.py` and check this line matches your actual function:
```python
from ..gemini_client import generate as gemini_generate
```
If your function in `gemini_client.py` has a different name or signature (e.g. `generate_response(prompt, ...)`), just adjust that one import line and the `gemini_generate(prompt)` call.

## 5. Wire into main.py
```python
from rag.router import router as rag_router
app.include_router(rag_router, prefix="/api/copilot", tags=["copilot"])
```

## 6. Test it
```bash
curl -X POST http://localhost:8000/api/copilot/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "Am I eligible for Mudra loan as a woman starting a dairy farm?", "language": "en"}'
```

## Why this design
- **Grounding / no hallucination**: if no PDF chunk scores above the similarity threshold, the endpoint returns a "not found in documents" fallback instead of calling Gemini with weak/no context.
- **Bilingual**: `paraphrase-multilingual-MiniLM-L12-v2` embeds Hindi and English into the same vector space — a Hindi question can retrieve an English PDF chunk (and vice versa), so you don't need separate Hindi/English indexes.
- **$0 cost, fully local retrieval**: embeddings + vector search run on your CPU via ChromaDB's persistent SQLite mode. Only the final answer generation hits Gemini's free tier.
- **Citations**: every chunk carries its source filename + page number, returned in the API response and referenced in the prompt, so the Copilot can show "Source: Mudra_Yojana_Guidelines.pdf, Page 4" to judges.

## Tuning knobs (in `rag/ingest.py` and `rag/retriever.py`)
- `CHUNK_SIZE` / `CHUNK_OVERLAP` — smaller chunks = more precise retrieval but less context per chunk.
- `top_k` in `retrieve()` — how many chunks get sent to Gemini per query.
- `max_distance` in `retrieve()` — lower = stricter relevance filter (fewer but more relevant hits).
