import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_compress_api():
    payload = {
        "prompt": "Hello! Important instruction: Always return JSON format. Make sure JSON is valid.",
        "level": "high",
        "preset": "general",
        "bypass_cache": True
    }
    response = client.post("/compress", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "compressed_prompt" in data
    assert "metrics" in data
    assert data["metrics"]["original_tokens"] > 0

def test_benchmark_api():
    payload = {"level": "medium"}
    response = client.post("/benchmark", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "total_prompts" in data
    assert data["total_prompts"] > 0

def test_history_api():
    response = client.get("/history")
    assert response.status_code == 200
    assert "history" in response.json()
