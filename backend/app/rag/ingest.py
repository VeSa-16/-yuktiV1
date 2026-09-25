"""
One-time (or re-run-on-demand) ingestion script.

Reads every PDF in rag/scheme_pdfs/, splits into overlapping chunks,
embeds them with a free multilingual local model, and stores them
in a local ChromaDB (persisted as SQLite files — no server needed).

Run:
    python -m rag.ingest
"""

import os
import hashlib
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ---- Config ----------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PDF_DIR = BASE_DIR / "scheme_pdfs"
CHROMA_DIR = BASE_DIR / "chroma_store"
COLLECTION_NAME = "yuktifi_schemes"

# Multilingual model -> handles English + Hindi (and code-mixed) text
# in the SAME vector space, so a Hindi question can retrieve an
# English PDF chunk and vice versa.
EMBED_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

CHUNK_SIZE = 800        # characters per chunk
CHUNK_OVERLAP = 120     # overlap so answers near a chunk boundary aren't lost


def get_chroma_client():
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(CHROMA_DIR))


def get_embedding_fn():
    return embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBED_MODEL_NAME
    )


def extract_text_by_page(pdf_path: Path):
    reader = PdfReader(str(pdf_path))
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        text = text.strip()
        if text:
            pages.append((i + 1, text))
    return pages


def chunk_id(source: str, page: int, idx: int) -> str:
    raw = f"{source}-{page}-{idx}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:24]


def ingest():
    if not PDF_DIR.exists() or not any(PDF_DIR.glob("*.pdf")):
        print(f"No PDFs found in {PDF_DIR}. Drop your scheme PDFs there and re-run.")
        return

    client = get_chroma_client()
    embed_fn = get_embedding_fn()

    # Fresh collection each run — fine for a small static prototype corpus.
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_ids, all_docs, all_metas = [], [], []

    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    print(f"Found {len(pdf_files)} PDF(s). Extracting + chunking...")

    for pdf_path in pdf_files:
        source_name = pdf_path.name
        pages = extract_text_by_page(pdf_path)
        for page_num, page_text in pages:
            chunks = splitter.split_text(page_text)
            for idx, chunk in enumerate(chunks):
                all_ids.append(chunk_id(source_name, page_num, idx))
                all_docs.append(chunk)
                all_metas.append({
                    "source": source_name,
                    "page": page_num,
                })

    if not all_docs:
        print("No extractable text found in the PDFs (are they scanned images?).")
        return

    print(f"Embedding {len(all_docs)} chunks with {EMBED_MODEL_NAME} (CPU, local, free)...")

    # Batch in groups to keep memory sane for larger corpora later.
    BATCH = 128
    for start in range(0, len(all_docs), BATCH):
        end = start + BATCH
        collection.add(
            ids=all_ids[start:end],
            documents=all_docs[start:end],
            metadatas=all_metas[start:end],
        )

    print(f"Done. {len(all_docs)} chunks stored in {CHROMA_DIR}")


if __name__ == "__main__":
    ingest()
