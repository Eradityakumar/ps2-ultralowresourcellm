import pytest
from app.compression.engine import compression_engine
from app.compression.preservation import preservation_analyzer
from app.compression.plugins.code_compressor import CodeCompressorPlugin
from app.compression.plugins.chat_compressor import ConversationCompressorPlugin

def test_instruction_preservation():
    prompt = "Hello. Important rule: Always encrypt user data using SHA256. Never store plain text passwords. Good day!"
    result = compression_engine.compress_prompt(prompt, compression_level="high", bypass_cache=True)
    
    comp_text = result["compressed_prompt"]
    assert "Always encrypt user data" in comp_text or "Never store plain text" in comp_text
    assert result["metrics"]["compression_ratio"] > 0

def test_entity_preservation():
    text = "Deploy server to https://api.production.com with API key sk-live-9988776655443322."
    entities = preservation_analyzer.extract_entities(text)
    assert len(entities["urls"]) > 0 or len(entities["api_keys"]) > 0

def test_code_compressor_plugin():
    plugin = CodeCompressorPlugin()
    code_input = """# This is a sample comment
import os
import sys
import os

def hello():
    # Inside comment
    return 'world'
"""
    res = plugin.compress(code_input, target_ratio=0.5, options={})
    compressed = res["compressed_text"]
    assert "# This is a sample comment" not in compressed
    assert "def hello():" in compressed
    assert "return 'world'" in compressed

def test_chat_compressor_plugin():
    plugin = ConversationCompressorPlugin()
    chat_input = """User: Hello! Good morning! Hope you are well.
Assistant: Hi there! How can I help you today?
User: I need to reset my password for account #49201.
Assistant: Sure! To reset password for account #49201, click on the reset link."""
    res = plugin.compress(chat_input, target_ratio=0.5, options={})
    compressed = res["compressed_text"]
    assert "reset my password" in compressed or "#49201" in compressed
