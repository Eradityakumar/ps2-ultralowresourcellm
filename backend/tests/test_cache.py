import pytest
from app.compression.cache import semantic_cache_manager

def test_fingerprint_generation():
    prompt_a = "  Hello World!  "
    prompt_b = "hello world!"
    fp_a = semantic_cache_manager.generate_fingerprint(prompt_a)
    fp_b = semantic_cache_manager.generate_fingerprint(prompt_b)
    assert fp_a == fp_b
    assert len(fp_a) == 64
