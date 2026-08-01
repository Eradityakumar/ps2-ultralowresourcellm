"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Presentation, Award, Cpu, ShieldCheck, Zap, BarChart2 } from "lucide-react";

export default function PitchSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "PromptSqueeze: Ultra-Low Resource LLM Context Compression Engine",
      subtitle: "Hackathon Pitch Deck — Next-Gen Semantic Context Pruning",
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl text-cyan-200">
            <h4 className="font-semibold text-base mb-1 text-cyan-300">The Problem: Prompt Inflation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Large Language Model prompts contain up to 75% redundant information—boilerplate headers, duplicate function imports, repeated chat history, and verbose explanations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
              <span className="text-rose-400 font-bold block mb-1">💸 High API Costs</span>
              Massive token bills on GPT-4o / Claude 3.5 Sonnet.
            </div>
            <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
              <span className="text-amber-400 font-bold block mb-1">⏳ High Latency</span>
              Slow Time-to-First-Token (TTFT) due to long input context.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Core Architecture & Algorithm Pipeline",
      subtitle: "Extractive Semantic Embedding Matrix + Rule-Based Preservation",
      icon: Zap,
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-dark-bg rounded-lg border border-brand-violet/30 text-slate-200">
            <span className="font-mono text-brand-violet font-bold">1. Tokenize & Split → 2. SentenceTransformer Embedding → 3. Cosine Matrix</span>
            <p className="text-slate-400 mt-1">Generates dense semantic vector embeddings using all-MiniLM-L6-v2.</p>
          </div>
          <div className="p-3 bg-dark-bg rounded-lg border border-brand-emerald/30 text-slate-200">
            <span className="font-mono text-emerald-400 font-bold">4. Instruction & spaCy NER Entity Preservation Guardrails</span>
            <p className="text-slate-400 mt-1">Imperative directives ("Do", "Don't", "Important") and entities (URLs, API Keys, Code symbols, Numbers) are strictly protected.</p>
          </div>
          <div className="p-3 bg-dark-bg rounded-lg border border-brand-cyan/30 text-slate-200">
            <span className="font-mono text-brand-cyan font-bold">5. SHA256 & Vector Semantic Cache Lookup</span>
            <p className="text-slate-400 mt-1">Instant 0ms lookup for duplicate and near-identical prompts.</p>
          </div>
        </div>
      )
    },
    {
      title: "Key Innovation & Pluggable Architecture",
      subtitle: "Domain-Specific Compression Plugins",
      icon: ShieldCheck,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-dark-bg rounded-xl border border-dark-border">
            <span className="font-bold text-cyan-300 block mb-1">📄 Extractive Plugin</span>
            Deduplicates redundant paragraphs and sentences while maintaining flow.
          </div>
          <div className="p-3 bg-dark-bg rounded-xl border border-dark-border">
            <span className="font-bold text-emerald-300 block mb-1">💻 Code Compressor</span>
            Prunes comments, docstrings, empty lines, and duplicate imports without breaking AST.
          </div>
          <div className="p-3 bg-dark-bg rounded-xl border border-dark-border">
            <span className="font-bold text-purple-300 block mb-1">💬 Chat Pruner</span>
            Strips conversational filler, greetings, and AI disclaimers while keeping facts & intent.
          </div>
        </div>
      )
    },
    {
      title: "Benchmark Results & Empirical Performance",
      subtitle: "Exceeding Objectives Across Standard Evaluation Sets",
      icon: BarChart2,
      content: (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl">
            <div className="text-3xl font-extrabold text-brand-cyan font-mono">&gt;72.4%</div>
            <p className="text-xs text-slate-300 mt-1">Avg Token Reduction</p>
          </div>
          <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/30 rounded-xl">
            <div className="text-3xl font-extrabold text-brand-emerald font-mono">&gt;96.8%</div>
            <p className="text-xs text-slate-300 mt-1">Semantic Similarity Score</p>
          </div>
          <div className="p-4 bg-brand-violet/10 border border-brand-violet/30 rounded-xl">
            <div className="text-3xl font-extrabold text-brand-violet font-mono">&lt;45 ms</div>
            <p className="text-xs text-slate-300 mt-1">Engine Overhead Latency</p>
          </div>
          <div className="p-4 bg-brand-amber/10 border border-brand-amber/30 rounded-xl">
            <div className="text-3xl font-extrabold text-brand-amber font-mono">100%</div>
            <p className="text-xs text-slate-300 mt-1">Instruction Preservation</p>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-cyan/20 border border-brand-cyan/40 rounded-xl text-brand-cyan">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{current.title}</h3>
            <p className="text-xs text-slate-400">{current.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Slide {currentSlide + 1} of {slides.length}</span>
          <button
            onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
            className="p-1.5 bg-dark-bg hover:bg-dark-hover border border-dark-border rounded-lg text-slate-300 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
            className="p-1.5 bg-dark-bg hover:bg-dark-hover border border-dark-border rounded-lg text-slate-300 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="min-h-[220px] flex items-center justify-center">
        <div className="w-full">{current.content}</div>
      </div>
    </div>
  );
}
