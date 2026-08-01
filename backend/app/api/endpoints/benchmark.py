from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.benchmarks.benchmark_suite import benchmark_suite

router = APIRouter()

class BenchmarkRequest(BaseModel):
    level: str = Field("high", description="Compression level to evaluate: low, medium, high, extreme")

@router.post("/benchmark")
def benchmark_endpoint(payload: BenchmarkRequest, db: Session = Depends(get_db)):
    """
    Triggers execution of the automated benchmark evaluation suite.
    Evaluates token reduction %, semantic similarity, cost and latency savings.
    """
    summary = benchmark_suite.run_benchmark(compression_level=payload.level, db=db)
    return summary
