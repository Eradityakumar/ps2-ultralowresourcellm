"use client";

import { CompressMetrics } from "@/lib/api";
import { TrendingDown, DollarSign, Clock, CheckCircle2, FileCode } from "lucide-react";

interface AnalyticsCardsProps {
  metrics: CompressMetrics;
  similarityScore: number;
  strategyUsed: string;
  executionTimeMs: number;
}

export default function AnalyticsCards({
  metrics,
  similarityScore,
  strategyUsed,
  executionTimeMs,
}: AnalyticsCardsProps) {
  const simPercent = Math.round(similarityScore * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Card 1: Token Reduction % */}
      <div className="glass-panel p-4 flex flex-col justify-between border-brand-cyan/30 bg-gradient-to-br from-brand-cyan/10 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compression %</span>
          <TrendingDown className="w-4 h-4 text-brand-cyan animate-bounce" />
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-brand-cyan font-mono">
            {metrics.compression_ratio}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {metrics.original_tokens} → {metrics.compressed_tokens} tokens
          </p>
        </div>
        <div className="w-full bg-dark-bg h-1.5 rounded-full overflow-hidden border border-dark-border">
          <div
            className="bg-gradient-to-r from-brand-cyan to-brand-violet h-full transition-all duration-500"
            style={{ width: `${Math.min(100, metrics.compression_ratio)}%` }}
          />
        </div>
      </div>

      {/* Card 2: Cost Saved */}
      <div className="glass-panel p-4 flex flex-col justify-between border-brand-emerald/30 bg-gradient-to-br from-brand-emerald/10 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Est. Cost Saved</span>
          <DollarSign className="w-4 h-4 text-brand-emerald" />
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-brand-emerald font-mono">
            ${metrics.cost_saved_usd.toFixed(5)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Saved {metrics.saved_tokens} input tokens</p>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">GPT-4o Input Rate Tier</span>
      </div>

      {/* Card 3: Latency Savings */}
      <div className="glass-panel p-4 flex flex-col justify-between border-brand-violet/30 bg-gradient-to-br from-brand-violet/10 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latency Saved</span>
          <Clock className="w-4 h-4 text-brand-violet" />
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-brand-violet font-mono">
            {metrics.latency_saved_ms} ms
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Faster LLM TTFT (Time to First Token)</p>
        </div>
        <span className="text-[10px] text-purple-300 font-mono">Engine overhead: {executionTimeMs} ms</span>
      </div>

      {/* Card 4: Semantic Similarity */}
      <div className="glass-panel p-4 flex flex-col justify-between border-brand-amber/30 bg-gradient-to-br from-brand-amber/10 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Semantic Fidelity</span>
          <CheckCircle2 className="w-4 h-4 text-brand-amber" />
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-brand-amber font-mono">
            {simPercent}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cosine Similarity Score ({similarityScore})</p>
        </div>
        <div className="w-full bg-dark-bg h-1.5 rounded-full overflow-hidden border border-dark-border">
          <div
            className="bg-brand-amber h-full transition-all duration-500"
            style={{ width: `${simPercent}%` }}
          />
        </div>
      </div>

      {/* Card 5: Strategy Used */}
      <div className="glass-panel p-4 flex flex-col justify-between border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Strategy Plugin</span>
          <FileCode className="w-4 h-4 text-slate-400" />
        </div>
        <div className="my-2">
          <div className="text-lg font-bold text-slate-200 capitalize font-mono truncate">
            {strategyUsed.replace("_", " ")}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active Plugin Pipeline</p>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">MiniLM-L6-v2 Embeddings</span>
      </div>
    </div>
  );
}
