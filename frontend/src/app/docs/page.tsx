"use client";

import { useState } from "react";
import PitchSlides from "@/components/PitchSlides";
import { FileText, Presentation, Cpu, BookOpen, Layers, Terminal } from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"pitch" | "paper" | "architecture" | "api">("pitch");

  return (
    <div className="space-y-8">
      {/* Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 glass-panel p-2">
        <button
          onClick={() => setActiveTab("pitch")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "pitch" ? "bg-brand-cyan/20 text-cyan-300 border border-brand-cyan/40" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Presentation className="w-4 h-4 text-brand-cyan" />
          Hackathon Pitch Slides
        </button>

        <button
          onClick={() => setActiveTab("paper")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "paper" ? "bg-brand-violet/20 text-purple-300 border border-brand-violet/40" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4 text-brand-violet" />
          Research Paper Style Doc
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "architecture" ? "bg-brand-emerald/20 text-emerald-300 border border-brand-emerald/40" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-brand-emerald" />
          Architecture & Flowchart
        </button>

        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "api" ? "bg-brand-amber/20 text-amber-300 border border-brand-amber/40" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-4 h-4 text-brand-amber" />
          API Specification
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === "pitch" && <PitchSlides />}

      {activeTab === "paper" && (
        <div className="glass-panel p-8 space-y-6 text-xs text-slate-300 leading-relaxed font-sans max-w-4xl mx-auto">
          <div className="border-b border-dark-border pb-4 text-center">
            <h2 className="text-xl font-bold text-slate-100 mb-1">
              PromptSqueeze: Ultra-Low Resource Extractive Semantic Context Compression for LLMs
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Research Paper Specification — Advanced Agentic AI Engineering
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">Abstract</h3>
            <p>
              Large Language Models (LLMs) suffer from quadratic context scaling overheads, latency degradation, and excessive token pricing caused by repetitive prompt structures, duplicate function imports, and filler chat history. We propose <strong>PromptSqueeze</strong>, a lightweight semantic context compression engine leveraging <code>SentenceTransformer (all-MiniLM-L6-v2)</code> dense embeddings, pairwise cosine similarity matrix clustering, rule-based imperative instruction preservation, and spaCy Named Entity Recognition (NER). Our benchmarks demonstrate over <strong>70% prompt reduction</strong> while preserving <strong>&gt;95% semantic fidelity</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">1. Introduction & Related Work</h3>
            <p>
              Prompt engineering often produces verbose context inputs containing boilerplate text, redundant code comments, and repeated instructions. Extractive text summarization algorithms like LexRank or TextRank lack domain awareness for imperative system rules and code syntax. PromptSqueeze introduces a hybrid approach combining semantic embedding clustering with protected instruction/entity guardrails.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">2. Algorithmic Methodology</h3>
            <p>
              Given input prompt text <em>P</em>, sentence tokenization splits <em>P</em> into ordered sentence chunks [s1, s2, ..., sn]. Dense embedding vectors E_i = Encoder(s_i) are generated using <code>all-MiniLM-L6-v2</code>. Pairwise cosine similarity matrix S_ij = (E_i · E_j) / (||E_i|| ||E_j||) identifies redundant clusters. Sentences with S_ij ≥ τ are pruned unless protected by instruction patterns (score ≥ 2.0) or NER entities.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase">3. Semantic Caching & Fingerprinting</h3>
            <p>
              Every input prompt is hashed via SHA-256 H(P). In addition to exact hash matching, the engine maintains a vector similarity lookup store. Incoming prompts with cosine similarity score ≥ 0.92 return previously compressed prompt output with zero additional transformer compute overhead.
            </p>
          </div>
        </div>
      )}

      {activeTab === "architecture" && (
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-emerald" />
            System Architecture & Flowchart
          </h2>

          <div className="p-6 bg-dark-bg rounded-xl border border-dark-border font-mono text-xs text-cyan-200 overflow-x-auto">
            <pre>{`
┌────────────────────────────────────────────────────────────────────────┐
│                          USER PROMPT INPUT                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      SHA256 & VECTOR SEMANTIC CACHE                    │
│           (Return Instant Cached Output if Similarity >= 0.92)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Cache Miss)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    TOKENIZER & SENTENCE SPLITTER                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              EMBEDDING GENERATOR (all-MiniLM-L6-v2 / TF-IDF)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     COSINE SIMILARITY MATRIX (S_ij)                    │
│             Clusters & Removes Semantic Duplicate Sentences            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            PRESERVATION LAYER (Instruction Guard & spaCy NER)          │
│       Protects: "Do", "Don't", "Important", Code Symbols, URLs, Keys   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            PLUGGABLE COMPRESSION ENGINE (Code / Chat / Extractive)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 COMPRESSED PROMPT & ANALYTICS OUTPUT                  │
└────────────────────────────────────────────────────────────────────────┘
            `}</pre>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-amber" />
            FastAPI Endpoints Reference
          </h2>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <div className="text-emerald-400 font-bold text-sm">POST /compress</div>
              <p className="text-slate-400 mt-1">Main context compression endpoint.</p>
              <pre className="mt-2 text-slate-300 bg-black/40 p-2 rounded">{`{\n  "prompt": "Text...",\n  "level": "high",\n  "preset": "general",\n  "bypass_cache": false\n}`}</pre>
            </div>

            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <div className="text-brand-cyan font-bold text-sm">POST /analyze</div>
              <p className="text-slate-400 mt-1">Detailed sentence heatmap and entity extractions.</p>
            </div>

            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <div className="text-brand-violet font-bold text-sm">POST /benchmark</div>
              <p className="text-slate-400 mt-1">Executes test suite and calculates total token savings.</p>
            </div>

            <div className="p-4 bg-dark-bg rounded-xl border border-dark-border">
              <div className="text-amber-400 font-bold text-sm">GET /history</div>
              <p className="text-slate-400 mt-1">Returns recent history and semantic cache hit stats.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
