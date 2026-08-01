import hashlib
import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.models import SemanticCache
from app.embeddings.vector_store import vector_store
from app.core.config import settings

logger = logging.getLogger(__name__)

class SemanticCacheManager:
    """
    Semantic Cache & Prompt Fingerprinting Engine.
    Employs SHA-256 fingerprinting for exact matches + vector similarity search
    for semantically duplicate incoming prompts.
    """

    @staticmethod
    def generate_fingerprint(prompt: str) -> str:
        """Generates SHA256 hex string from normalized prompt text."""
        normalized = prompt.strip().lower()
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

    def get_cached_compression(self, prompt: str, db: Session) -> Optional[Dict[str, Any]]:
        fingerprint = self.generate_fingerprint(prompt)

        # 1. Exact Match Lookup via SHA256 Fingerprint
        exact_entry = db.query(SemanticCache).filter(SemanticCache.fingerprint_sha256 == fingerprint).first()
        if exact_entry:
            logger.info(f"Semantic Cache EXACT MATCH Hit! Fingerprint: {fingerprint[:8]}...")
            return {
                "compressed_text": exact_entry.compressed_prompt,
                "is_cache_hit": True,
                "cache_match_type": "exact_sha256",
                "similarity_score": 1.0,
                "tokens_saved": exact_entry.tokens_saved
            }

        # 2. Vector Semantic Similarity Lookup for near-identical prompts
        recent_cache_entries = db.query(SemanticCache).order_by(SemanticCache.id.desc()).limit(100).all()
        for entry in recent_cache_entries:
            sim_score = vector_store.calculate_overall_similarity(prompt, entry.original_prompt)
            if sim_score >= settings.SEMANTIC_CACHE_SIMILARITY_THRESHOLD:
                logger.info(f"Semantic Cache VECTOR SIMILARITY Hit ({sim_score:.4f})")
                return {
                    "compressed_text": entry.compressed_prompt,
                    "is_cache_hit": True,
                    "cache_match_type": "vector_similarity",
                    "similarity_score": round(sim_score, 4),
                    "tokens_saved": entry.tokens_saved
                }

        return None

    def store_in_cache(self, original_prompt: str, compressed_prompt: str, tokens_saved: int, db: Session):
        fingerprint = self.generate_fingerprint(original_prompt)
        try:
            existing = db.query(SemanticCache).filter(SemanticCache.fingerprint_sha256 == fingerprint).first()
            if not existing:
                cache_entry = SemanticCache(
                    fingerprint_sha256=fingerprint,
                    original_prompt=original_prompt,
                    compressed_prompt=compressed_prompt,
                    tokens_saved=tokens_saved,
                    similarity_score=1.0
                )
                db.add(cache_entry)
                db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to save entry to semantic cache: {e}")

semantic_cache_manager = SemanticCacheManager()
