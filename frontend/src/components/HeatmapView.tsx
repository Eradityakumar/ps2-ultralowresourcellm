"use client";

import { SentenceMapItem } from "@/lib/api";
import { Activity, ShieldAlert, Sparkles } from "lucide-react";

interface HeatmapViewProps {
  sentenceMap: SentenceMapItem[];
}

export default function HeatmapView({ sentenceMap }: HeatmapViewProps) {
  if (!sentenceMap || sentenceMap.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-cyan" />
            Context Importance Spectrum Heatmap
          </h4>
          <p className="text-xs text-slate-400">Sentence importance weights calculated via embedding centrality and preservation rules</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-3 h-3 rounded bg-emerald-500"></span> High (Rules/Entities)
          </span>
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-3 h-3 rounded bg-cyan-500"></span> Medium (Context)
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-3 h-3 rounded bg-slate-700"></span> Low (Filler)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-1">
        {sentenceMap.map((item, idx) => {
          const isPreserved = item.status === "preserved";
          const isInstruction = item.is_instruction;
          const score = item.score || 1.0;

          let colorClass = "bg-slate-900/60 border-slate-800 text-slate-500";
          if (isPreserved) {
            if (isInstruction || score >= 2.0) {
              colorClass = "bg-emerald-950/40 border-emerald-500/40 text-emerald-200 shadow-sm shadow-emerald-500/10";
            } else {
              colorClass = "bg-cyan-950/40 border-cyan-500/40 text-cyan-200 shadow-sm shadow-cyan-500/10";
            }
          }

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border font-mono text-xs transition-all hover:scale-[1.01] ${colorClass}`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] opacity-80 font-sans">
                <span className="font-semibold">Sentence #{idx + 1}</span>
                <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                  Weight: {score.toFixed(1)}
                </span>
              </div>
              <p className="line-clamp-2 text-slate-200">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
