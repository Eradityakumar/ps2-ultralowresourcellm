import re
import logging
from typing import Set, List, Dict, Any, Tuple

logger = logging.getLogger(__name__)

# Fallback spaCy loading with regex backup
_spacy_nlp = None
try:
    import spacy
    try:
        _spacy_nlp = spacy.load("en_core_web_sm")
    except Exception:
        # If model not pre-downloaded, create simple blank model
        _spacy_nlp = spacy.blank("en")
except Exception:
    logger.warning("spaCy not available, using pure Regex for Entity & Instruction detection")


INSTRUCTION_PATTERNS = [
    r"\b(do|don't|do not|never|always|must|shall|should|important|critical|warning|note|rule|rules|constraint|constraints|requirement|requirements)\b",
    r"\b(output|return|format|json|xml|markdown|respond with|your task is|make sure|ensure|keep|preserve)\b",
    r"\b(step \d+|phase \d+|1\.|2\.|3\.|4\.|5\.)\b",
    r"^\s*(?:system|user|assistant):",
    r"\b(no matter what|under no circumstances)\b"
]

ENTITY_PATTERNS = {
    "url": r"https?://[^\s]+",
    "email": r"[\w\.-]+@[\w\.-]+\.\w+",
    "api_key": r"\b(sk-[a-zA-Z0-9]{20,}|bearer\s+[a-zA-Z0-9\._\-]+|[a-f0-9]{32,64})\b",
    "filepath": r"(?:/[a-zA-Z0-9_\-\.]+)+|\b[a-zA-Z0-9_\-]+\.(?:py|js|ts|tsx|json|yaml|yml|md|txt|html|css|cpp|c|h|java|go|rs|sh)\b",
    "code_identifier": r"\b(?:def|class|function|const|let|var|import|from|return|async|await)\s+([a-zA-Z_][a-zA-Z0-9_]*)",
    "number_or_date": r"\b\d+(?:\.\d+)?(?:%|k|m|b|ms|s|gb|mb)?\b|\b\d{4}-\d{2}-\d{2}\b"
}


class PreservationAnalyzer:
    """
    Analyzes sentence strings to flag protected elements:
    - Must-keep instructions (Do, Don't, Always, Never, etc.)
    - Must-keep entities (NER names, dates, numbers, code variables, API keys, URLs)
    """

    def is_instruction_sentence(self, sentence: str) -> bool:
        """Determines if a sentence contains high-priority system rules or imperative instructions."""
        sent_lower = sentence.lower()
        for pattern in INSTRUCTION_PATTERNS:
            if re.search(pattern, sent_lower):
                return True
        return False

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """Extracts named entities, code references, URLs, numbers, and API keys."""
        entities = {
            "spacy_ner": [],
            "urls": [],
            "filepaths": [],
            "api_keys": [],
            "code_symbols": [],
            "numbers": []
        }

        # Regex extractions
        entities["urls"] = re.findall(ENTITY_PATTERNS["url"], text)
        entities["filepaths"] = re.findall(ENTITY_PATTERNS["filepath"], text)
        entities["api_keys"] = re.findall(ENTITY_PATTERNS["api_key"], text, re.IGNORECASE)
        entities["code_symbols"] = re.findall(ENTITY_PATTERNS["code_identifier"], text)
        entities["numbers"] = re.findall(ENTITY_PATTERNS["number_or_date"], text)

        # spaCy NER extractions
        if _spacy_nlp:
            try:
                doc = _spacy_nlp(text)
                for ent in doc.ents:
                    if ent.label_ in ["PERSON", "ORG", "GPE", "DATE", "TIME", "CARDINAL", "MONEY", "QUANTITY", "PRODUCT"]:
                        entities["spacy_ner"].append(f"{ent.text} ({ent.label_})")
            except Exception:
                pass

        return entities

    def calculate_sentence_preservation_score(self, sentence: str) -> Tuple[float, List[str]]:
        """
        Returns a preservation score multiplier and list of reasons to preserve this sentence.
        Multiplier >= 1.0 means protected or elevated priority.
        """
        reasons = []
        multiplier = 0.0

        if self.is_instruction_sentence(sentence):
            multiplier += 2.5
            reasons.append("Imperative Instruction / Constraint")

        entities = self.extract_entities(sentence)
        entity_count = (len(entities["urls"]) + len(entities["filepaths"]) + 
                        len(entities["api_keys"]) + len(entities["code_symbols"]) + 
                        len(entities["spacy_ner"]))

        if entity_count > 0:
            multiplier += min(1.5, 0.4 * entity_count)
            reasons.append(f"Contains {entity_count} critical entities/symbols")

        # Questions usually contain important user queries
        if sentence.strip().endswith("?"):
            multiplier += 1.2
            reasons.append("Question / Query Intent")

        return multiplier, reasons

preservation_analyzer = PreservationAnalyzer()
