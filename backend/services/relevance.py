from sentence_transformers import SentenceTransformer
import requests
from bs4 import BeautifulSoup
import numpy as np
import math
from urllib.parse import urlparse

from trusted_domains import (
    build_field_embeddings,
    trusted_domain_score,
)

# INITIALISATION
# Models and field embeddings are built once at import time.

embedding_model = SentenceTransformer("../llm/all-MiniLM-L6-v2")
field_embeddings = build_field_embeddings(embedding_model)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

STOPWORDS = {
    "i", "will", "my", "about", "the", "for", "on", "a", "an", "and",
    "to", "in", "of", "with", "am", "is", "are", "want", "need",
    "going", "do", "be", "this", "that", "it", "at", "we", "us",
    "how", "what", "some",
}


# Text Utility

def simplify_goal(goal: str) -> str:
    return " ".join(w for w in goal.lower().split() if w not in STOPWORDS)


def chunk_text(text: str, chunk_size: int = 80, max_chunks: int = 40) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i : i + chunk_size]))
        if len(chunks) >= max_chunks:
            break
    return chunks


def extract_text_from_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=7, headers=HEADERS)
        if response.status_code != 200:
            return ""
        soup = BeautifulSoup(response.text, "html.parser")
    except requests.RequestException:
        return ""

    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "form", "iframe"]):
        tag.decompose()

    headings = soup.find_all(["title", "h1", "h2", "h3"])
    heading_text = (
        " ".join(el.get_text(separator=" ", strip=True) for el in headings) + " "
    ) * 3

    body = soup.find_all(["p", "article", "li", "code", "pre", "td", "blockquote"])
    body_text = " ".join(el.get_text(separator=" ", strip=True) for el in body)

    return " ".join((heading_text + " " + body_text).split())

# SCORING

def cosine_similarity_matrix(goal_vec: np.ndarray, chunk_vecs: np.ndarray) -> np.ndarray:
    """Vectorised cosine similarity of goal against every chunk."""
    g_norm = np.linalg.norm(goal_vec)
    c_norms = np.linalg.norm(chunk_vecs, axis=1, keepdims=True)
    if g_norm == 0:
        return np.zeros(len(chunk_vecs))
    goal_vec  = goal_vec  / g_norm
    chunk_vecs = chunk_vecs / np.where(c_norms == 0, 1, c_norms)
    return np.dot(chunk_vecs, goal_vec)


def scale_similarity(similarities: np.ndarray, top_k: int = 5) -> float:
    """
    Convert raw cosine scores → 0–100 relevancy via weighted top-k + sigmoid.

    Sigmoid centred at 0.35 (typical mid-relevance for all-MiniLM-L6-v2):
      ~0.20 → ~20   barely related
      ~0.30 → ~45   minor relevance
      ~0.40 → ~75   somewhat relevant
      ~0.50 → ~92   pretty relevant
      ~0.60 → ~99   highly relevant
    """
    if len(similarities) == 0:
        return 0.0

    top_k = min(top_k, len(similarities))
    top_scores = np.sort(similarities)[-top_k:]
    weights = np.linspace(0.5, 1.0, num=len(top_scores))
    weighted_sim = max(0.0, float(np.average(top_scores, weights=weights)))

    k, midpoint = 18, 0.35
    sigmoid  = lambda x: 1 / (1 + math.exp(-k * (x - midpoint)))
    sig_min  = sigmoid(0.0)
    sig_max  = sigmoid(1.0)

    return round((sigmoid(weighted_sim) - sig_min) / (sig_max - sig_min) * 100, 2)


def apply_penalties(score: float, url: str, page_text: str) -> float:
    """
    Post-scale penalties for thin or homepage content.

    - Very short pages (<50 words)   → 0      (bot wall / empty shell)
    - Thin pages (50–150 words)      → ×0.40
    - Sparse pages (150–300 words)   → ×0.70
    - Homepage (path == "/")         → ×0.45  (marketing text inflates scores)
    """
    word_count = len(page_text.split())
    if word_count < 50:
        return 0.0
    if word_count < 150:
        score *= 0.40
    elif word_count < 300:
        score *= 0.70
    if urlparse(url).path.rstrip("/") == "":
        score *= 0.45
    return round(score, 2)


# PUBLIC API

def relevance_score_for_url(url: str, goal: str) -> dict:
    simplified = simplify_goal(goal)
    goal_embedding = embedding_model.encode(simplified)

    t_score = trusted_domain_score(url, goal_embedding, field_embeddings)

    page_text = extract_text_from_url(url)
    c_score = 0.0

    if page_text:
        chunks = chunk_text(page_text)
        if chunks:
            chunk_embeddings = embedding_model.encode(
                chunks, batch_size=8, show_progress_bar=False
            )
            similarities = cosine_similarity_matrix(goal_embedding, chunk_embeddings)
            c_score = scale_similarity(similarities, top_k=5)
            c_score = apply_penalties(c_score, url, page_text)

    if t_score is not None:
        final = max(t_score, c_score)
    else:
        final = c_score

    return {"url": url, "goal": goal, "relevancy": round(final, 2)}