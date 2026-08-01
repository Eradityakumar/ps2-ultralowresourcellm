# PromptSqueeze Hackathon Live Demonstration Script

Follow this step-by-step presentation script during your hackathon demo judging:

---

## Step 1: Introduction (30 seconds)
> "Judges, every company using LLMs faces the Prompt Inflation Crisis. Up to 75% of every prompt sent to GPT-4o or Claude is filler text—duplicate paragraphs, greetings, and repetitive code comments. This bloats API bills and doubles latency.
> Today we present **PromptSqueeze**: an ultra-low resource semantic context compression engine that cuts prompt tokens by over 70% while preserving 95%+ semantic intent."

---

## Step 2: Live Demo — General Prompt Compression (1 minute)
1. Open the **PromptSqueeze Studio** dashboard (`http://localhost:3000`).
2. Click **"General"** sample prompt button under the controls panel.
3. Set Compression Level to **High (72%)**.
4. Click **"Execute Compression"**.
5. **Point out the metrics cards**:
   - Token reduction ratio: ~72%
   - Estimated USD cost saved
   - Cosine similarity score (>95%)
6. Toggle **"Side-by-Side Diff"** and **"Annotated Inspection"** to show:
   - Green highlight on protected imperative rules ("MUST use TLS 1.3 encryption").
   - Cyan highlight on protected API keys (`sk-live-...`).
   - Red strikethrough on pruned filler lines ("Hello!", "Hope you are doing well").

---

## Step 3: Domain-Specific Plugins — Codebase & Chat (1 minute)
1. Click **"Code"** sample prompt. Observe how python comments and duplicate imports are removed while keeping syntax valid.
2. Click **"Chat"** sample prompt. Show how greetings ("Good morning!") are stripped while retaining account ID `#48291` and API error details.

---

## Step 4: Benchmark & LLM Playground (1 minute)
1. Navigate to **"Analytics & Benchmarks"** tab.
2. Click **"Run Benchmark Suite"** and highlight the Recharts visual graph showing token reduction across Docs, Code, Chat, and Server logs.
3. Navigate to **"LLM Playground"** tab to demonstrate side-by-side execution latency comparison.

---

## Step 5: Wrap-up & Slide Deck (30 seconds)
1. Navigate to **"Docs & Pitch Deck"** tab.
2. Showcase the built-in presentation deck, architecture sitemap, and research paper documentation.
3. Open for Q&A.
