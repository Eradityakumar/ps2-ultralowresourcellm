import tiktoken
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class TokenizerHelper:
    """
    Token counter and metrics calculation using tiktoken (cl100k_base / o200k_base).
    """
    def __init__(self, model_name: str = "gpt-4o"):
        try:
            self.encoding = tiktoken.encoding_for_model(model_name)
        except Exception:
            try:
                self.encoding = tiktoken.get_encoding("cl100k_base")
            except Exception:
                self.encoding = None

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        if self.encoding:
            try:
                return len(self.encoding.encode(text))
            except Exception:
                pass
        # Fallback estimation: average ~4 chars per token
        return max(1, len(text) // 4)

    def calculate_metrics(self, original_text: str, compressed_text: str):
        orig_tokens = self.count_tokens(original_text)
        comp_tokens = self.count_tokens(compressed_text)
        
        saved_tokens = max(0, orig_tokens - comp_tokens)
        reduction_ratio = ((orig_tokens - comp_tokens) / orig_tokens * 100.0) if orig_tokens > 0 else 0.0
        
        # Financial & Performance Analytics
        cost_saved = (saved_tokens / 1000.0) * settings.COST_PER_1K_TOKENS
        latency_saved_ms = (saved_tokens / 1000.0) * settings.LATENCY_PER_1K_TOKENS_MS
        
        return {
            "original_tokens": orig_tokens,
            "compressed_tokens": comp_tokens,
            "saved_tokens": saved_tokens,
            "compression_ratio": round(reduction_ratio, 2),
            "cost_saved_usd": round(cost_saved, 6),
            "latency_saved_ms": round(latency_saved_ms, 2)
        }

tokenizer_helper = TokenizerHelper()
