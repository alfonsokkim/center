import openai
import requests
from bs4 import BeautifulSoup
import numpy as np
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def extractTextFromUrl(url: str) -> str:
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    return soup.get_text(separator=" ", strip=True)

def getEmbedding(text: str, model="text-embedding-3-small"):
    response = openai.Embedding.create(
        model=model,
        input=text
    )
    return response.data[0].embedding

def cosineSimilarity(a, b):
    a = np.array(a)
    b = np.array(b)
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if (norm_a == 0 or norm_b == 0):
        return 0.0
    return (dot / (norm_a * norm_b))

def relevanceScoreForUrl(url: str, goal: str):
    text = extract_text_from_url(url)

    goal_embedding = get_embedding(goal)
    text_embedding = get_embedding(text)

    simmilarity = cosine_similarity(goal_embedding, text_embedding)

    relevancy = round(simmilarity * 100, 2)

    return {"url": url, "goal": goal, "relevancy": relevancy}