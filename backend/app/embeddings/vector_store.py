import math
import re
import logging
import numpy as np
from typing import List
from collections import Counter
from app.core.config import settings

logger = logging.getLogger(__name__)

class VectorStore:
    """
    Ultra-lightweight Sentence Embedding Generator & Cosine Similarity Store.
    Employs pure Python / NumPy TF-IDF term frequency vectorization with fallback
    to SentenceTransformers if installed. Zero external binary bloat required!
    """

    def __init__(self):
        self._model = None
        self._initialize_model()

    def _initialize_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading SentenceTransformer model: {settings.EMBEDDING_MODEL_NAME}")
            self._model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
        except Exception:
            logger.info("SentenceTransformer not available. Using ultra-fast pure TF-IDF vectorizer.")

    def _tokenize_words(self, text: str) -> List[str]:
        return re.findall(r"\b\w+\b", text.lower())

    def encode(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.array([])

        if self._model is not None:
            try:
                embeddings = self._model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
                norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
                norms[norms == 0] = 1e-10
                return embeddings / norms
            except Exception:
                pass

        # Pure Python / NumPy Term Frequency Vectorizer
        vocab = {}
        text_counters = []

        for text in texts:
            words = self._tokenize_words(text)
            counter = Counter(words)
            text_counters.append(counter)
            for word in counter:
                if word not in vocab:
                    vocab[word] = len(vocab)

        if not vocab:
            return np.zeros((len(texts), 1))

        dim = len(vocab)
        num_docs = len(texts)
        matrix = np.zeros((num_docs, dim), dtype=np.float32)

        # Compute document frequency for IDF
        doc_freq = Counter()
        for counter in text_counters:
            for word in counter:
                doc_freq[word] += 1

        for i, counter in enumerate(text_counters):
            for word, freq in counter.items():
                idx = vocab[word]
                idf = math.log((1 + num_docs) / (1 + doc_freq[word])) + 1.0
                matrix[i, idx] = freq * idf

        # Normalize rows to unit vectors
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1e-10
        return matrix / norms

    def compute_similarity_matrix(self, embeddings: np.ndarray) -> np.ndarray:
        if embeddings.size == 0:
            return np.array([[]])
        return np.dot(embeddings, embeddings.T)

    def calculate_overall_similarity(self, text_a: str, text_b: str) -> float:
        if not text_a.strip() or not text_b.strip():
            return 1.0 if text_a.strip() == text_b.strip() else 0.0
        vecs = self.encode([text_a, text_b])
        if len(vecs) < 2:
            return 0.0
        score = float(np.dot(vecs[0], vecs[1]))
        return max(0.0, min(1.0, score))

# Global Singleton Instance
vector_store = VectorStore()
