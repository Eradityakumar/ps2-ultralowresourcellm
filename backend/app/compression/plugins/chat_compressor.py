import re
from typing import Dict, Any, List
from app.compression.plugin_interface import BaseCompressorPlugin
from app.compression.preservation import preservation_analyzer

GREETING_FILLER_PATTERNS = [
    r"^\s*(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b",
    r"^\s*(hope you are doing well|how are you|thanks|thank you|sure thing|no problem|you are welcome)\b",
    r"\b(as an ai language model|i'd be happy to help|let me know if you need anything else|is there anything else i can help with)\b",
    r"^\s*(sure|of course|certainly|absolutely)!?\s*$"
]

class ConversationCompressorPlugin(BaseCompressorPlugin):
    """
    Chat History & Multi-turn Dialogue Compressor.
    Strips pleasantries, repetitive AI disclaimers, greetings, and conversational fluff while
    preserving core user query intent, facts, system constraints, and decisions.
    """

    @property
    def name(self) -> str:
        return "chat_compressor"

    @property
    def description(self) -> str:
        return "Prunes conversational pleasantries, AI boilerplate greetings/disclaimers, retaining user intent & memory."

    def compress(self, text: str, target_ratio: float, options: Dict[str, Any]) -> Dict[str, Any]:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        sentence_map = []
        kept_lines = []

        for line in lines:
            line_lower = line.lower()
            
            # Check for filler / greetings
            is_filler = False
            for pat in GREETING_FILLER_PATTERNS:
                if re.search(pat, line_lower):
                    is_filler = True
                    break

            if is_filler and not preservation_analyzer.is_instruction_sentence(line):
                sentence_map.append({
                    "text": line,
                    "status": "pruned_greeting_filler",
                    "score": 0.1,
                    "reasons": ["Conversational pleasantry / AI filler greeting removed"],
                    "is_instruction": False
                })
                continue

            # Preservation check
            pres_score, pres_reasons = preservation_analyzer.calculate_sentence_preservation_score(line)
            
            # Keep line
            kept_lines.append(line)
            sentence_map.append({
                "text": line,
                "status": "preserved",
                "score": round(1.0 + pres_score, 2),
                "reasons": pres_reasons if pres_reasons else ["Dialogue Memory / Intent"],
                "is_instruction": pres_score >= 2.0
            })

        compressed_text = "\n".join(kept_lines)

        return {
            "compressed_text": compressed_text,
            "sentence_map": sentence_map,
            "plugin_metadata": {
                "strategy": "chat_compressor",
                "original_dialogue_lines": len(lines),
                "compressed_dialogue_lines": len(kept_lines)
            }
        }
