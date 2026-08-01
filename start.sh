#!/bin/bash

echo "================================================================="
echo "  PromptSqueeze: Ultra-Low Resource Context Compression Engine  "
echo "================================================================="

# Start Frontend setup & server in background
(
  echo "[Frontend] Installing Node.js dependencies..."
  cd frontend
  if [ ! -d "node_modules" ]; then
      npm install
  fi
  echo "[Frontend] Launching Next.js Studio Dashboard on http://localhost:3000..."
  npm run dev
) &
FRONTEND_PID=$!

# Start Backend setup & server
(
  echo "[Backend] Setting up Python virtual environment & dependencies..."
  cd backend
  if [ ! -d "venv" ]; then
      python3 -m venv venv
  fi
  source venv/bin/activate
  pip install -r requirements.txt
  python -m spacy download en_core_web_sm || true
  echo "[Backend] Launching FastAPI Backend on http://localhost:8000..."
  uvicorn app.main:app --host 0.0.0.0 --port 8000
) &
BACKEND_PID=$!

wait $FRONTEND_PID $BACKEND_PID
