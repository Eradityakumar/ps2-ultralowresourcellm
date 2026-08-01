import os
import json
import time
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.compression.engine import compression_engine
from app.db.models import BenchmarkResult

logger = logging.getLogger(__name__)

BENCHMARK_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "benchmark_prompts.json")

class BenchmarkSuite:
    """
    Automated Benchmark Evaluator for Context Compression Engine.
    Executes compression across test prompts and computes summary metrics.
    """

    @staticmethod
    def load_benchmark_dataset() -> List[Dict[str, Any]]:
        if os.path.exists(BENCHMARK_DATA_PATH):
            try:
                with open(BENCHMARK_DATA_PATH, "r") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading benchmark dataset: {e}")
        
        # Fallback inline test prompts
        return [
            {
                "id": "fallback_1",
                "category": "general",
                "name": "General Test Prompt",
                "prompt": "Hello! Important rule: Always validate user input. Please make sure that inputs are checked for null values. Never allow SQL injection attacks. Thank you very much!"
            }
        ]

    def run_benchmark(self, compression_level: str = "high", db: Session = None) -> Dict[str, Any]:
        prompts = self.load_benchmark_dataset()
        results = []
        
        total_orig_tokens = 0
        total_comp_tokens = 0
        total_cost_saved = 0.0
        total_latency_saved = 0.0
        similarity_scores = []
        compression_ratios = []

        start_benchmark_time = time.time()

        for item in prompts:
            original_text = item["prompt"]
            preset = item.get("category", "general")
            if preset not in ["code", "chat"]:
                preset = "general"

            comp_result = compression_engine.compress_prompt(
                prompt=original_text,
                compression_level=compression_level,
                preset_type=preset,
                bypass_cache=True,  # Benchmark should test raw compression engine
                db=None
            )

            metrics = comp_result["metrics"]
            total_orig_tokens += metrics["original_tokens"]
            total_comp_tokens += metrics["compressed_tokens"]
            total_cost_saved += metrics["cost_saved_usd"]
            total_latency_saved += metrics["latency_saved_ms"]
            
            ratio = metrics["compression_ratio"]
            sim_score = comp_result["semantic_similarity_score"]
            
            compression_ratios.append(ratio)
            similarity_scores.append(sim_score)

            results.append({
                "id": item["id"],
                "name": item["name"],
                "category": item["category"],
                "original_tokens": metrics["original_tokens"],
                "compressed_tokens": metrics["compressed_tokens"],
                "compression_ratio": ratio,
                "semantic_similarity": sim_score,
                "cost_saved_usd": metrics["cost_saved_usd"],
                "latency_saved_ms": metrics["latency_saved_ms"],
                "strategy_used": comp_result["strategy_used"]
            })

        avg_ratio = round(sum(compression_ratios) / len(compression_ratios), 2) if compression_ratios else 0.0
        avg_sim = round(sum(similarity_scores) / len(similarity_scores), 4) if similarity_scores else 0.0
        total_benchmark_time = round((time.time() - start_benchmark_time) * 1000, 2)

        summary = {
            "total_prompts": len(prompts),
            "compression_level_tested": compression_level,
            "total_original_tokens": total_orig_tokens,
            "total_compressed_tokens": total_comp_tokens,
            "overall_compression_percentage": round(((total_orig_tokens - total_comp_tokens) / total_orig_tokens * 100.0), 2) if total_orig_tokens > 0 else 0.0,
            "avg_compression_ratio": avg_ratio,
            "avg_semantic_similarity": avg_sim,
            "total_cost_saved_usd": round(total_cost_saved, 6),
            "total_latency_saved_ms": round(total_latency_saved, 2),
            "total_benchmark_execution_ms": total_benchmark_time,
            "individual_results": results
        }

        # Persist benchmark run to SQLite DB
        if db:
            try:
                bm_entry = BenchmarkResult(
                    dataset_name="Standard Hackathon Benchmark Suite",
                    total_prompts=len(prompts),
                    original_token_sum=total_orig_tokens,
                    compressed_token_sum=total_comp_tokens,
                    avg_compression_ratio=summary["overall_compression_percentage"],
                    avg_similarity_score=avg_sim,
                    total_cost_saved=total_cost_saved,
                    total_latency_saved_ms=total_latency_saved
                )
                db.add(bm_entry)
                db.commit()
            except Exception as e:
                db.rollback()
                logger.error(f"Error persisting benchmark result: {e}")

        return summary

benchmark_suite = BenchmarkSuite()
