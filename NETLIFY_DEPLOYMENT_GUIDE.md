# Step-by-Step Netlify Deployment Guide

This guide walks you through deploying **PromptSqueeze** to Netlify.

---

## 🏗️ Deployment Architecture

- **Frontend (Next.js 14)**: Deployed to Netlify (`netlify.toml` included).
- **Backend (FastAPI Python)**: Deployed to Render / Railway / Fly.io / Docker free tier (or Netlify API Proxy).

---

## Option 1: Deploying via Netlify Web UI (Recommended)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit for Netlify deployment"
git remote add origin https://github.com/YOUR_USERNAME/prompt-squeeze.git
git push -u origin main
```

### Step 2: Connect GitHub Repository to Netlify
1. Log into your [Netlify Dashboard](https://app.netlify.com).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access to your repository.

### Step 3: Configure Netlify Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-fastapi-backend-url.onrender.com` (or your deployed backend API URL)

4. Click **"Deploy site"**. Netlify will automatically build and publish your Next.js application!

---

## Option 2: Deploying via Netlify CLI

If you have `netlify-cli` installed:

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Log into Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --build --prod
```

---

## 🐍 Deploying the Python FastAPI Backend (Free Tier Options)

Since Netlify specializes in Frontend/Edge Node hosting, deploy your Python FastAPI backend to one of these free hosting providers:

### Render.com (Recommended Free Python Hosting)
1. Log into [Render.com](https://render.com).
2. Click **"New +"** → **"Web Service"**.
3. Connect your GitHub repository and set:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Copy your Render web service URL (e.g. `https://prompt-squeeze-api.onrender.com`) and add it to your Netlify Environment Variables as `NEXT_PUBLIC_API_URL`.

---

## 🛠️ Verification
After deployment:
1. Open your Netlify site URL (e.g. `https://your-site.netlify.app`).
2. Test compression on the live Netlify production site!
