"use client";

import { useState } from "react";
import { SentenceMapItem } from "@/lib/api";
import { Check, Copy, Download, ShieldCheck, Tag, Trash2, Eye, Zap } from "lucide-react";

interface DiffViewerProps {
  originalPrompt: string;
  compressedPrompt: string;
  sentenceMap: SentenceMapItem[];
  isCacheHit?: boolean;
}

export default function DiffViewer({
  originalPrompt,
  compressedPrompt,
  sentenceMap,
  isCacheHit,
}: DiffViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"sideBySide" | "annotated" | "compressedOnly">("sideBySide");

  const handleCopy = () => {
    navigator.clipboard.writeText(compressedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([compressedPrompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "compressed_prompt.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-dark-bg/80 border-b border-dark-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-cyan" />
            Compression Inspection Studio
          </h4>
          {isCacheHit && (
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> SHA256 / Vector Cache Hit
            </span>
          )}
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-dark-card p-1 rounded-lg border border-dark-border text-xs">
            <button
              onClick={() => setActiveTab("sideBySide")}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === "sideBySide" ? "bg-brand-cyan/20 text-cyan-300 border border-brand-cyan/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Side-by-Side Diff
            </button>
            <button
              onClick={() => setActiveTab("annotated")}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === "annotated" ? "bg-brand-cyan/20 text-cyan-300 border border-brand-cyan/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Annotated Inspection
            </button>
            <button
              onClick={() => setActiveTab("compressedOnly")}
              className={`px-3 py-1 rounded-md transition-all font-medium ${
                activeTab === "compressedOnly" ? "bg-brand-cyan/20 text-cyan-300 border border-brand-cyan/30" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Compressed Output
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 bg-dark-bg hover:bg-dark-hover border border-dark-border text-slate-300 rounded-lg transition-all flex items-center gap-1 text-xs"
            title="Copy Compressed Text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/40 text-cyan-200 rounded-lg transition-all flex items-center gap-1 text-xs font-medium"
            title="Download Compressed File"
          >
            <Download className="w-4 h-4 text-brand-cyan" />
            Download
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="px-5 py-2 bg-dark-card/40 border-b border-dark-border/60 flex flex-wrap items-center gap-4 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-400"></span> Preserved Instruction
        </span>
        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/40 border border-cyan-300"></span> Preserved Entity/Code Logic
        </span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-400"></span> Removed Redundant Filler
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto">
        {activeTab === "sideBySide" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Box */}
            <div className="bg-dark-bg/80 p-4 rounded-xl border border-dark-border space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border/60 text-slate-400 font-sans font-semibold">
                <span>Original Prompt</span>
                <span className="text-[10px] bg-dark-card px-2 py-0.5 rounded border border-dark-border">{originalPrompt.length} chars</span>
              </div>
              <div className="whitespace-pre-wrap text-slate-300">
                {originalPrompt}
              </div>
            </div>

            {/* Compressed Box */}
            <div className="bg-dark-bg/80 p-4 rounded-xl border border-brand-cyan/30 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border/60 text-cyan-300 font-sans font-semibold">
                <span>Compressed Output</span>
                <span className="text-[10px] bg-brand-cyan/20 px-2 py-0.5 rounded border border-brand-cyan/40">{compressedPrompt.length} chars</span>
              </div>
              <div className="whitespace-pre-wrap text-cyan-100">
                {compressedPrompt}
              </div>
            </div>
          </div>
        )}

        {activeTab === "annotated" && (
          <div className="space-y-2 bg-dark-bg/80 p-4 rounded-xl border border-dark-border">
            {sentenceMap && sentenceMap.length > 0 ? (
              sentenceMap.map((item, idx) => {
                const isPreserved = item.status === "preserved";
                const isInstruction = item.is_instruction;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isPreserved
                        ? isInstruction
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                          : "bg-cyan-500/10 border-cyan-500/30 text-cyan-200"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-300 line-through opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px] font-sans font-medium opacity-80">
                      <span className="flex items-center gap-1.5">
                        {isPreserved ? (
                          isInstruction ? (
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Tag className="w-3 h-3 text-cyan-400" />
                          )
                        ) : (
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        )}
                        Sentence #{idx + 1} — {item.status}
                      </span>
                      <span>Importance Score: {item.score}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{item.text}</p>
                    {item.reasons && item.reasons.length > 0 && (
                      <div className="mt-1.5 pt-1 border-t border-white/5 flex flex-wrap gap-1 font-sans text-[10px]">
                        {item.reasons.map((r, rIdx) => (
                          <span key={rIdx} className="bg-black/30 px-1.5 py-0.5 rounded text-slate-300">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="whitespace-pre-wrap text-slate-300">{originalPrompt}</div>
            )}
          </div>
        )}

        {activeTab === "compressedOnly" && (
          <div className="bg-dark-bg/90 p-4 rounded-xl border border-brand-cyan/40 text-cyan-100 whitespace-pre-wrap">
            {compressedPrompt}
          </div>
        )}
      </div>
    </div>
  );
}
