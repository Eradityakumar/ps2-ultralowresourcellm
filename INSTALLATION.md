# PromptSqueeze Installation & Deployment Guide

This guide details environment setup, dependency management, Docker execution, and troubleshooting for **PromptSqueeze**.

---

## System Requirements

- **Operating System**: macOS, Linux, or Windows (WSL2 recommended)
- **Python**: 3.10 or higher
- **Node.js**: 18.0.0 or higher
- **Docker**: Optional (for containerized deployment)

---

## 1. Automated Setup Script

The quickest way to get up and running:
```bash
chmod +x start.sh
./start.sh
```

---

## 2. Manual Installation

### Backend Setup (FastAPI + SentenceTransformers)
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Download spaCy English model:
   ```bash
   python -m spacy download en_core_web_sm
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *The backend will automatically create SQLite database `prompt_squeeze.db` on startup.*

### Frontend Setup (Next.js 14 Studio)
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your web browser.

---

## 3. Docker Deployment

To run both services in production containers:

```bash
docker-compose up --build -d
```

To stop containers:
```bash
docker-compose down
```

---

## 4. Environment Variables

| Variable | Default Value | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./prompt_squeeze.db` | SQLite database URI |
| `EMBEDDING_MODEL_NAME` | `sentence-transformers/all-MiniLM-L6-v2` | HuggingFace embedding model |
| `DEFAULT_SIMILARITY_THRESHOLD` | `0.78` | Cosine similarity threshold for deduplication |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Frontend API endpoint |
