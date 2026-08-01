import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.db.database import Base

class PromptHistory(Base):
    __tablename__ = "prompt_history"

    id = Column(Integer, primary_key=True, index=True)
    fingerprint_sha256 = Column(String(64), index=True)
    original_prompt = Column(Text, nullable=False)
    compressed_prompt = Column(Text, nullable=False)
    original_tokens = Column(Integer, nullable=False)
    compressed_tokens = Column(Integer, nullable=False)
    compression_ratio = Column(Float, nullable=False)  # percentage, e.g. 72.5
    cost_saved = Column(Float, nullable=False)         # USD
    latency_saved_ms = Column(Float, nullable=False)   # ms
    semantic_similarity = Column(Float, nullable=False)# cosine score
    compression_level = Column(String(32), default="medium")
    preset_type = Column(String(32), default="general")
    is_cache_hit = Column(Integer, default=0)          # 1 if cache hit
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SemanticCache(Base):
    __tablename__ = "semantic_cache"

    id = Column(Integer, primary_key=True, index=True)
    fingerprint_sha256 = Column(String(64), unique=True, index=True, nullable=False)
    original_prompt = Column(Text, nullable=False)
    compressed_prompt = Column(Text, nullable=False)
    tokens_saved = Column(Integer, nullable=False)
    similarity_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BenchmarkResult(Base):
    __tablename__ = "benchmark_results"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String(64), nullable=False)
    total_prompts = Column(Integer, nullable=False)
    original_token_sum = Column(Integer, nullable=False)
    compressed_token_sum = Column(Integer, nullable=False)
    avg_compression_ratio = Column(Float, nullable=False)
    avg_similarity_score = Column(Float, nullable=False)
    total_cost_saved = Column(Float, nullable=False)
    total_latency_saved_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
