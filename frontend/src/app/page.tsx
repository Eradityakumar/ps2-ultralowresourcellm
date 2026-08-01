"use client";

import { useState, useEffect } from "react";
import CompressionControls from "@/components/CompressionControls";
import AnalyticsCards from "@/components/AnalyticsCards";
import DiffViewer from "@/components/DiffViewer";
import HeatmapView from "@/components/HeatmapView";
import { compressPrompt, fetchHistory, CompressResponse } from "@/lib/api";
import { Zap, Play, History, Loader2, Sparkles } from "lucide-react";

export default function CompressorStudio() {
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState("high");
  const [preset, setPreset] = useState("general");
  const [bypassCache, setBypassCache] = useState(false);
  
  const [result, setResult] = useState<CompressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await fetchHistory();
      if (data && data.history) {
        setRecentHistory(data.history);
      }
    } catch (e) {
      console.warn("Could not fetch history:", e);
    }
  };

  const handleCompress = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await compressPrompt(prompt, level, preset, bypassCache);
      setResult(res);
      loadHistory();
    } catch (e: any) {
      setError(e.message || "Compression failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sampleText: string, samplePreset: string) => {
    setPrompt(sampleText);
    setPreset(samplePreset);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-brand-cyan/10 via-dark-card/80 to-brand-violet/10 border-brand-cyan/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-spin" />
              Intelligent Semantic Context Compressor
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Compress Prompts by <span className="bg-gradient-to-r from-brand-cyan to-brand-violet bg-clip-text text-transparent">&gt;70%</span> While Preserving Semantic Intent
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Prune duplicate ideas, filler greetings, verbose commentary, and redundant codebase imports while protecting critical rules, entities, and code logic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCompress}
              disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-violet hover:from-cyan-500 hover:to-purple-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-brand-cyan/25 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  Compressing Vector Context...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-slate-900" />
                  Execute Compression
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <CompressionControls
        level={level}
        setLevel={setLevel}
        preset={preset}
        setPreset={setPreset}
        bypassCache={bypassCache}
        setBypassCache={setBypassCache}
        onLoadSample={handleLoadSample}
        isLoading={isLoading}
      />

      {/* Prompt Input Textarea */}
      <div className="glass-panel p-5 space-y-3 border-brand-cyan/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Play className="w-4 h-4 text-brand-cyan" />
            Input Prompt Context
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400">
              {prompt.length} characters | ~{Math.max(1, Math.floor(prompt.length / 4))} tokens
            </span>
            <button
              onClick={handleCompress}
              disabled={isLoading || !prompt.trim()}
              className="px-5 py-2 bg-gradient-to-r from-brand-cyan to-brand-violet hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold rounded-xl shadow-md shadow-brand-cyan/20 flex items-center gap-2 text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  Compressing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-slate-950" />
                  Compress Prompt
                </>
              )}
            </button>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste your verbose LLM prompt, codebase file, chat log, or documentation here..."
          rows={7}
          className="w-full bg-dark-bg/80 border border-dark-border rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan/60 focus:ring-1 focus:ring-brand-cyan/60 transition-all resize-y"
        />
        <div className="flex justify-end pt-1">
          <button
            onClick={handleCompress}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-brand-cyan via-cyan-400 to-brand-violet hover:brightness-110 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-brand-cyan/20 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Processing Vector Compression...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-slate-950" />
                ⚡ Compress Context Now
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Compression Results */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Analytics Cards */}
          <AnalyticsCards
            metrics={result.metrics}
            similarityScore={result.semantic_similarity_score}
            strategyUsed={result.strategy_used}
            executionTimeMs={result.execution_time_ms}
          />

          {/* Diff Viewer */}
          <DiffViewer
            originalPrompt={result.original_prompt}
            compressedPrompt={result.compressed_prompt}
            sentenceMap={result.sentence_map}
            isCacheHit={result.is_cache_hit}
          />

          {/* Sentence Heatmap */}
          <HeatmapView sentenceMap={result.sentence_map} />
        </div>
      )}

      {/* Recent History Drawer */}
      {recentHistory.length > 0 && (
        <div className="glass-panel p-5 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-brand-cyan" />
            Recent Prompt History & Semantic Cache Activity
          </h4>
          <div className="divide-y divide-dark-border max-h-48 overflow-y-auto pr-1">
            {recentHistory.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 truncate max-w-lg">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.is_cache_hit ? "bg-cyan-500/20 text-cyan-300" : "bg-dark-border text-slate-300"
                  }`}>
                    {item.is_cache_hit ? "Cache Hit" : `${item.compression_ratio}% Saved`}
                  </span>
                  <span className="text-slate-300 truncate">{item.original_prompt}</span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-3">
                  <span>{item.original_tokens} → {item.compressed_tokens} tokens</span>
                  <span className="text-emerald-400">${item.cost_saved.toFixed(5)} saved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
