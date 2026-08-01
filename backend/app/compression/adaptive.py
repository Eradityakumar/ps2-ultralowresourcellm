from typing import Dict, Any, Tuple

class AdaptiveCompressionLevel:
    """
    Translates user-selectable compression levels into algorithmic hyper-parameters.
    """
    LEVEL_MAP = {
        "low": {
            "target_ratio": 0.25,
            "similarity_threshold": 0.88,
            "description": "Conservative pruning (20-30% reduction). Highest fidelity."
        },
        "medium": {
            "target_ratio": 0.50,
            "similarity_threshold": 0.78,
            "description": "Balanced compression (45-55% reduction). Recommended default."
        },
        "high": {
            "target_ratio": 0.72,
            "similarity_threshold": 0.70,
            "description": "Aggressive pruning (>70% reduction). Removes all non-essential filler."
        },
        "extreme": {
            "target_ratio": 0.85,
            "similarity_threshold": 0.60,
            "description": "Extreme compression (80-90% reduction). Minimalist context skeleton."
        }
    }

    @classmethod
    def resolve_level(cls, level_name: str) -> Tuple[float, float, str]:
        normalized = level_name.lower().strip()
        config = cls.LEVEL_MAP.get(normalized, cls.LEVEL_MAP["medium"])
        return config["target_ratio"], config["similarity_threshold"], config["description"]
