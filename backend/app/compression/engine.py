import time
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.compression.plugin_interface import BaseCompressorPlugin
from app.compression.plugins.extractive import ExtractiveSemanticCompressor
from app.compression.plugins.code_compressor import CodeCompressorPlugin
from app.compression.plugins.chat_compressor import ConversationCompressorPlugin
from app.compression.adaptive import AdaptiveCompressionLevel
from app.compression.tokenizer import tokenizer_helper
from app.compression.cache import semantic_cache_manager
from app.embeddings.vector_store import vector_store
from app.db.models import PromptHistory

logger = logging.getLogger(__name__)

class CompressionEngine:
    """
    Master Orchestrator for the Context Compression Engine.
    Handles plugin registry, semantic caching, adaptive ratio resolution,
    analytics scoring, and database history recording.
    """

    def __init__(self):
        self.plugins: Dict[str, BaseCompressorPlugin] = {}
        self._register_default_plugins()

    def _register_default_plugins(self):
        self.register_plugin(ExtractiveSemanticCompressor())
        self.register_plugin(CodeCompressorPlugin())
        self.register_plugin(ConversationCompressorPlugin())

    def register_plugin(self, plugin: BaseCompressorPlugin):
        logger.info(f"Registering Compression Plugin: {plugin.name}")
        self.plugins[plugin.name] = plugin

    def detect_preset_strategy(self, prompt: str, preset_override: Optional[str] = None) -> str:
        if preset_override and preset_override in ["code", "chat", "general"]:
            if preset_override == "code":
                return "code_compressor"
            elif preset_override == "chat":
                return "chat_compressor"
            return "extractive_semantic"

        # Automatic detection heuristic
        prompt_lower = prompt.lower()
        if any(kw in prompt for kw in ["def ", "class ", "function ", "import ", "const ", "var ", "return "]) and ("{" in prompt or ":" in prompt):
            return "code_compressor"
        if any(role in prompt_lower for role in ["user:", "assistant:", "system:", "human:", "ai:"]) or ("hello" in prompt_lower and "help" in prompt_lower):
            return "chat_compressor"
        
        return "extractive_semantic"

    def compress_prompt(
        self,
        prompt: str,
        compression_level: str = "high",
        preset_type: str = "general",
        bypass_cache: bool = False,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        
        # 1. Semantic Cache Check
        if not bypass_cache and db:
            cached_result = semantic_cache_manager.get_cached_compression(prompt, db)
            if cached_result:
                comp_text = cached_result["compressed_text"]
                metrics = tokenizer_helper.calculate_metrics(prompt, comp_text)
                sim_score = vector_store.calculate_overall_similarity(prompt, comp_text)
                
                exec_time_ms = round((time.time() - start_time) * 1000, 2)
                
                result_data = {
                    "original_prompt": prompt,
                    "compressed_prompt": comp_text,
                    "fingerprint_sha256": semantic_cache_manager.generate_fingerprint(prompt),
                    "is_cache_hit": True,
                    "cache_match_type": cached_result["cache_match_type"],
                    "metrics": metrics,
                    "semantic_similarity_score": round(sim_score, 4),
                    "compression_level": compression_level,
                    "preset_type": preset_type,
                    "strategy_used": "semantic_cache",
                    "execution_time_ms": exec_time_ms,
                    "sentence_map": []
                }
                
                # Record to history
                if db:
                    history_entry = PromptHistory(
                        fingerprint_sha256=result_data["fingerprint_sha256"],
                        original_prompt=prompt,
                        compressed_prompt=comp_text,
                        original_tokens=metrics["original_tokens"],
                        compressed_tokens=metrics["compressed_tokens"],
                        compression_ratio=metrics["compression_ratio"],
                        cost_saved=metrics["cost_saved_usd"],
                        latency_saved_ms=metrics["latency_saved_ms"],
                        semantic_similarity=round(sim_score, 4),
                        compression_level=compression_level,
                        preset_type=preset_type,
                        is_cache_hit=1
                    )
                    db.add(history_entry)
                    db.commit()

                return result_data

        # 2. Resolve Parameters & Plugin Selection
        target_ratio, sim_thresh, level_desc = AdaptiveCompressionLevel.resolve_level(compression_level)
        plugin_name = self.detect_preset_strategy(prompt, preset_type)
        plugin = self.plugins.get(plugin_name, self.plugins["extractive_semantic"])

        # 3. Execute Plugin Compression
        options = {
            "similarity_threshold": sim_thresh,
            "compression_level": compression_level,
            "preset_type": preset_type
        }
        compression_output = plugin.compress(prompt, target_ratio, options)
        compressed_text = compression_output["compressed_text"]

        # 4. Metrics & Semantic Similarity Evaluation
        metrics = tokenizer_helper.calculate_metrics(prompt, compressed_text)
        sim_score = vector_store.calculate_overall_similarity(prompt, compressed_text)
        exec_time_ms = round((time.time() - start_time) * 1000, 2)
        fingerprint = semantic_cache_manager.generate_fingerprint(prompt)

        # 5. Store in Cache if valid reduction
        if db and metrics["saved_tokens"] > 0:
            semantic_cache_manager.store_in_cache(prompt, compressed_text, metrics["saved_tokens"], db)

        # 6. Save Execution to History Database
        if db:
            try:
                history_entry = PromptHistory(
                    fingerprint_sha256=fingerprint,
                    original_prompt=prompt,
                    compressed_prompt=compressed_text,
                    original_tokens=metrics["original_tokens"],
                    compressed_tokens=metrics["compressed_tokens"],
                    compression_ratio=metrics["compression_ratio"],
                    cost_saved=metrics["cost_saved_usd"],
                    latency_saved_ms=metrics["latency_saved_ms"],
                    semantic_similarity=round(sim_score, 4),
                    compression_level=compression_level,
                    preset_type=preset_type,
                    is_cache_hit=0
                )
                db.add(history_entry)
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(f"Error recording prompt history: {e}")

        return {
            "original_prompt": prompt,
            "compressed_prompt": compressed_text,
            "fingerprint_sha256": fingerprint,
            "is_cache_hit": False,
            "metrics": metrics,
            "semantic_similarity_score": round(sim_score, 4),
            "compression_level": compression_level,
            "preset_type": preset_type,
            "strategy_used": plugin.name,
            "level_description": level_desc,
            "execution_time_ms": exec_time_ms,
            "sentence_map": compression_output.get("sentence_map", []),
            "plugin_metadata": compression_output.get("plugin_metadata", {})
        }

# Global Engine Instance
compression_engine = CompressionEngine()
