from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseCompressorPlugin(ABC):
    """
    Abstract base class for Compression Engine Plugins.
    Enables plug-and-play extension for specialized domain compressors
    (e.g., Extractive, Code, Conversation, Log Pruner, Summarizer).
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique identifier name for the plugin."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """Short description of the compression plugin."""
        pass

    @abstractmethod
    def compress(self, text: str, target_ratio: float, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compresses the input text.
        
        Args:
            text: Raw input prompt string
            target_ratio: Target compression ratio (0.0 to 1.0)
            options: Context parameters (similarity_threshold, preserve_entities, etc.)
            
        Returns:
            Dict containing:
            - 'compressed_text': str
            - 'sentence_map': List[Dict] (metadata for each sentence)
            - 'plugin_metadata': Dict
        """
        pass
