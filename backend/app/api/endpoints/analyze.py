from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.compression.preservation import preservation_analyzer
from app.compression.engine import compression_engine

router = APIRouter()

class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., min_length=1)
    level: str = "high"
    preset: str = "general"

@router.post("/analyze")
def analyze_endpoint(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Detailed Analysis Endpoint.
    Returns sentence importance scores, heatmap, extracted entities, and instruction breakdown.
    """
    result = compression_engine.compress_prompt(
        prompt=payload.prompt,
        compression_level=payload.level,
        preset_type=payload.preset,
        bypass_cache=True,
        db=None
    )

    extracted_entities = preservation_analyzer.extract_entities(payload.prompt)
    
    # Calculate heatmap spectrum (0.0 to 1.0 importance per sentence)
    sentence_heatmap = []
    for item in result.get("sentence_map", []):
        score = item.get("score", 1.0)
        status = item.get("status", "preserved")
        normalized_weight = min(1.0, max(0.1, score / 3.0)) if status == "preserved" else 0.1
        
        sentence_heatmap.append({
            "text": item.get("text"),
            "importance_weight": round(normalized_weight, 2),
            "status": status,
            "is_instruction": item.get("is_instruction", False),
            "reasons": item.get("reasons", [])
        })

    return {
        "metrics": result["metrics"],
        "semantic_similarity_score": result["semantic_similarity_score"],
        "extracted_entities": extracted_entities,
        "sentence_heatmap": sentence_heatmap,
        "fingerprint_sha256": result["fingerprint_sha256"]
    }
