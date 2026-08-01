import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "PromptSqueeze Context Compression Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # SQLite Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./prompt_squeeze.db")
    
    # Embedding Model Settings
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    DEFAULT_SIMILARITY_THRESHOLD: float = 0.78
    SEMANTIC_CACHE_SIMILARITY_THRESHOLD: float = 0.92
    
    # Cost Estimation ($ per 1K tokens - default based on GPT-4o input rate)
    COST_PER_1K_TOKENS: float = 0.0025
    LATENCY_PER_1K_TOKENS_MS: float = 450.0  # Estimated savings in LLM latency per 1k input tokens
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
