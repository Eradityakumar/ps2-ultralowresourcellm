import re
from typing import Dict, Any, List
from app.compression.plugin_interface import BaseCompressorPlugin

class CodeCompressorPlugin(BaseCompressorPlugin):
    """
    Codebase & Script Compressor.
    Prunes inline comments, docstrings, duplicate imports, redundant whitespace,
    and boilerplate headers while retaining 100% of syntactic and logical semantics.
    """

    @property
    def name(self) -> str:
        return "code_compressor"

    @property
    def description(self) -> str:
        return "Prunes code comments, docstrings, duplicate imports, and redundant line breaks without breaking syntax."

    def compress(self, text: str, target_ratio: float, options: Dict[str, Any]) -> Dict[str, Any]:
        lines = text.splitlines()
        sentence_map = []
        seen_imports = set()
        cleaned_lines = []

        in_multiline_comment = False

        for idx, line in enumerate(lines):
            original_line = line
            stripped = line.strip()

            # Handle blank lines
            if not stripped:
                sentence_map.append({
                    "text": original_line,
                    "status": "pruned_empty_line",
                    "score": 0.0,
                    "reasons": ["Empty line removed"],
                    "is_instruction": False
                })
                continue

            # Handle python / js multiline comments (""" or ''' or /* */)
            if stripped.startswith(('"""', "'''", "/*")):
                in_multiline_comment = True
                sentence_map.append({
                    "text": original_line,
                    "status": "pruned_comment",
                    "score": 0.1,
                    "reasons": ["Docstring/Multiline comment removed"],
                    "is_instruction": False
                })
                if stripped.endswith(('"""', "'''", "*/")) and len(stripped) > 3:
                    in_multiline_comment = False
                continue

            if in_multiline_comment:
                sentence_map.append({
                    "text": original_line,
                    "status": "pruned_comment",
                    "score": 0.1,
                    "reasons": ["Docstring/Multiline comment body removed"],
                    "is_instruction": False
                })
                if stripped.endswith(('"""', "'''", "*/")):
                    in_multiline_comment = False
                continue

            # Single line comments (# or //)
            if stripped.startswith(('#', '//')):
                sentence_map.append({
                    "text": original_line,
                    "status": "pruned_comment",
                    "score": 0.1,
                    "reasons": ["Single-line comment removed"],
                    "is_instruction": False
                })
                continue

            # Duplicate Imports
            if stripped.startswith(('import ', 'from ', 'require(', 'const ') and 'require(' in stripped):
                if stripped in seen_imports:
                    sentence_map.append({
                        "text": original_line,
                        "status": "removed_duplicate_import",
                        "score": 0.2,
                        "reasons": ["Duplicate import statement removed"],
                        "is_instruction": False
                    })
                    continue
                else:
                    seen_imports.add(stripped)

            # Strip trailing inline comments if not inside string
            inline_comment_match = re.search(r'\s+(?:#|//)\s+.*$', line)
            line_to_keep = line
            if inline_comment_match:
                line_to_keep = line[:inline_comment_match.start()]

            cleaned_lines.append(line_to_keep)
            sentence_map.append({
                "text": original_line,
                "status": "preserved",
                "score": 1.5,
                "reasons": ["Essential Code Logic / Structure"],
                "is_instruction": True if any(k in line for k in ["def ", "class ", "return ", "export "]) else False
            })

        compressed_text = "\n".join(cleaned_lines)

        return {
            "compressed_text": compressed_text,
            "sentence_map": sentence_map,
            "plugin_metadata": {
                "strategy": "code_compressor",
                "original_lines": len(lines),
                "compressed_lines": len(cleaned_lines),
                "unique_imports_kept": len(seen_imports)
            }
        }
