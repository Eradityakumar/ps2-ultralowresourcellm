import re
import numpy as np
from typing import Dict, Any, List
from app.compression.plugin_interface import BaseCompressorPlugin
from app.embeddings.vector_store import vector_store
from app.compression.preservation import preservation_analyzer

class ExtractiveSemanticCompressor(BaseCompressorPlugin):
    """
    Extractive Semantic Context Compressor.
    
    Algorithm Pipeline:
    1. Sentence Tokenization
    2. Vector Embedding Generation (MiniLM / Cosine Matrix)
    3. Pairwise Cosine Similarity Matrix computation & Semantic Duplicate Removal
    4. Instruction & Entity Preservation scoring
    5. Keyword & Context Importance Ranking
    6. Adaptive Threshold Pruning & Prompt Reconstruction
    """

    @property
    def name(self) -> str:
        return "extractive_semantic"

    @property
    def description(self) -> str:
        return "Extractive semantic similarity clustering and instruction-aware sentence pruning."

    def _split_sentences(self, text: str) -> List[str]:
        """Splits prompt into paragraph and sentence chunks while preserving formatting structures."""
        # Split on line breaks or standard sentence terminators (. ! ?) followed by space/newline
        raw_chunks = re.split(r'(?<=[.!?])\s+|\n\n+', text)
        sentences = []
        for chunk in raw_chunks:
            chunk_clean = chunk.strip()
            if chunk_clean:
                # If paragraph contains multiple lines, keep reasonable chunks
                lines = [l.strip() for l in chunk_clean.split("\n") if l.strip()]
                sentences.extend(lines)
        return sentences if sentences else [text]

    def compress(self, text: str, target_ratio: float, options: Dict[str, Any]) -> Dict[str, Any]:
        sentences = self._split_sentences(text)
        if len(sentences) <= 1:
            return {
                "compressed_text": text,
                "sentence_map": [{"text": text, "status": "preserved", "score": 1.0, "reasons": ["Single sentence"]}],
                "plugin_metadata": {"strategy": "extractive", "original_count": 1, "kept_count": 1}
            }

        similarity_threshold = options.get("similarity_threshold", 0.78)
        # Adjust threshold higher for aggressive target ratios
        if target_ratio > 0.6:
            similarity_threshold = max(0.65, similarity_threshold - 0.1)

        # 1. Generate Embeddings & Cosine Matrix
        embeddings = vector_store.encode(sentences)
        sim_matrix = vector_store.compute_similarity_matrix(embeddings)

        # 2. Analyze Preservation & Importance Scores
        sentence_meta = []
        for idx, sent in enumerate(sentences):
            pres_score, pres_reasons = preservation_analyzer.calculate_sentence_preservation_score(sent)
            
            # Position importance (start and end sentences often carry higher weight)
            position_score = 1.3 if idx == 0 or idx == len(sentences) - 1 else 1.0
            
            # Centrality score (average similarity to other sentences)
            centrality = float(np.mean(sim_matrix[idx])) if sim_matrix.size > 0 else 0.5
            
            final_score = (1.0 + pres_score) * position_score * (0.8 + 0.4 * centrality)
            
            sentence_meta.append({
                "index": idx,
                "text": sent,
                "preservation_multiplier": pres_score,
                "preservation_reasons": pres_reasons,
                "final_score": final_score,
                "status": "preserved", # default
                "duplicate_of": None
            })

        # 3. Deduplication via Cosine Similarity Matrix
        # Iterate over sentences; mark redundant nearly-identical sentences as removed
        visited_duplicates = set()
        n = len(sentences)
        for i in range(n):
            if i in visited_duplicates:
                continue
            for j in range(i + 1, n):
                if j in visited_duplicates:
                    continue
                similarity = sim_matrix[i][j]
                if similarity >= similarity_threshold:
                    # Protect instructions/entities: keep higher preservation score sentence
                    score_i = sentence_meta[i]["final_score"]
                    score_j = sentence_meta[j]["final_score"]
                    
                    # If sentence j is duplicate of sentence i:
                    if score_i >= score_j and sentence_meta[j]["preservation_multiplier"] < 2.0:
                        sentence_meta[j]["status"] = "removed_duplicate"
                        sentence_meta[j]["duplicate_of"] = i
                        sentence_meta[j]["preservation_reasons"].append(f"Semantic duplicate of Line #{i+1} ({round(similarity*100)}% match)")
                        visited_duplicates.add(j)
                    elif score_j > score_i and sentence_meta[i]["preservation_multiplier"] < 2.0:
                        sentence_meta[i]["status"] = "removed_duplicate"
                        sentence_meta[i]["duplicate_of"] = j
                        sentence_meta[i]["preservation_reasons"].append(f"Semantic duplicate of Line #{j+1} ({round(similarity*100)}% match)")
                        visited_duplicates.add(i)
                        break

        # 4. Adaptive Budget Pruning based on Target Compression Ratio
        total_count = len(sentence_meta)
        target_keep_count = max(1, int(total_count * (1.0 - target_ratio)))

        # Filter out duplicates first
        candidates = [s for s in sentence_meta if s["status"] == "preserved"]

        # Sort remaining candidates by score (descending) to determine budget cutoff
        if len(candidates) > target_keep_count:
            # Sort candidates by score
            sorted_candidates = sorted(candidates, key=lambda x: x["final_score"], reverse=True)
            
            # Keep top scoring items, mark lower scoring non-instruction items as pruned filler
            kept_set = set()
            for s in sorted_candidates:
                # Always preserve mandatory instructions (preservation_multiplier >= 2.0)
                if len(kept_set) < target_keep_count or s["preservation_multiplier"] >= 2.0:
                    kept_set.add(s["index"])
                else:
                    s["status"] = "pruned_low_importance"
                    s["preservation_reasons"].append("Pruned due to lower semantic weight / filler text")

        # 5. Prompt Reconstruction
        kept_sentences = [s["text"] for s in sentence_meta if s["status"] == "preserved"]
        compressed_text = "\n".join(kept_sentences)

        # Build detailed sentence map for UI visualization & diff highlighting
        sentence_map = []
        for s in sentence_meta:
            sentence_map.append({
                "text": s["text"],
                "status": s["status"],
                "score": round(s["final_score"], 2),
                "reasons": s["preservation_reasons"],
                "is_instruction": s["preservation_multiplier"] >= 2.0
            })

        return {
            "compressed_text": compressed_text,
            "sentence_map": sentence_map,
            "plugin_metadata": {
                "strategy": "extractive_semantic",
                "total_sentences": total_count,
                "kept_sentences": len(kept_sentences),
                "similarity_threshold_used": similarity_threshold
            }
        }
