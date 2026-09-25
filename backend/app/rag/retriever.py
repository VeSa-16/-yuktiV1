"""
Query-time retrieval. Loads the persisted ChromaDB collection and
returns the top-k most relevant chunks for a user question, in
either English or Hindi (same embedding space handles both).
"""

from functools import lru_cache

import chromadb

from .ingest import get_chroma_client, get_embedding_fn, COLLECTION_NAME


@lru_cache(maxsize=1)
def _get_collection():
    """Cached so the embedding model loads only once per process."""
    client = get_chroma_client()
    embed_fn = get_embedding_fn()
    return client.get_collection(name=COLLECTION_NAME, embedding_function=embed_fn)


def retrieve(query: str, top_k: int = 4, max_distance: float = 0.8):
    """
    Returns a list of dicts: {text, source, page, distance}
    Filters out weak matches (distance too high) so the LLM isn't
    fed irrelevant context that could cause hallucination.
    """
    collection = _get_collection()
    results = collection.query(query_texts=[query], n_results=top_k)

    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    hits = []
    for doc, meta, dist in zip(docs, metas, distances):
        if dist <= max_distance:
            hits.append({
                "text": doc,
                "source": meta.get("source"),
                "page": meta.get("page"),
                "distance": dist,
            })
    return hits


def build_context_block(hits: list) -> str:
    """Formats retrieved chunks into a citation-friendly context string for the LLM prompt."""
    if not hits:
        return ""
    parts = []
    for h in hits:
        parts.append(f"[Source: {h['source']}, Page {h['page']}]\n{h['text']}")
    return "\n\n---\n\n".join(parts)
