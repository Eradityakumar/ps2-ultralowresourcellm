from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.db.models import PromptHistory, SemanticCache

router = APIRouter()

@router.get("/history")
def history_endpoint(limit: int = 20, db: Session = Depends(get_db)):
    """
    Returns recent prompt compression history and semantic cache performance analytics.
    """
    history_records = db.query(PromptHistory).order_by(PromptHistory.id.desc()).limit(limit).all()
    cache_count = db.query(SemanticCache).count()
    
    total_prompts = db.query(PromptHistory).count()
    cache_hits = db.query(PromptHistory).filter(PromptHistory.is_cache_hit == 1).count()
    cache_hit_rate = round((cache_hits / total_prompts * 100.0), 2) if total_prompts > 0 else 0.0

    return {
        "history": history_records,
        "cache_stats": {
            "total_cached_entries": cache_count,
            "total_prompts_processed": total_prompts,
            "cache_hits": cache_hits,
            "cache_hit_rate_percent": cache_hit_rate
        }
    }
