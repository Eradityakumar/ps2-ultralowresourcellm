from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.compression.engine import compression_engine

router = APIRouter()

class CompressRequest(BaseModel):
    prompt: str = Field(..., description="Raw prompt text to compress", min_length=1)
    level: str = Field("high", description="Compression level: low, medium, high, extreme")
    preset: str = Field("general", description="Preset domain: general, code, chat")
    bypass_cache: bool = Field(False, description="Set True to bypass semantic cache lookup")

class CompressResponse(BaseModel):
    original_prompt: str
    compressed_prompt: str
    fingerprint_sha256: str
    is_cache_hit: bool
    metrics: Dict[str, Any]
    semantic_similarity_score: float
    compression_level: str
    preset_type: str
    strategy_used: str
    execution_time_ms: float
    sentence_map: List[Dict[str, Any]]

@router.post("/compress", response_model=CompressResponse)
def compress_endpoint(payload: CompressRequest, db: Session = Depends(get_db)):
    """
    Primary Context Compression API Endpoint.
    Prunes redundant sentences, removes filler, preserves instructions & entities.
    """
    try:
        result = compression_engine.compress_prompt(
            prompt=payload.prompt,
            compression_level=payload.level,
            preset_type=payload.preset,
            bypass_cache=payload.bypass_cache,
            db=db
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")
