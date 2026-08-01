"use client";

import { useState } from "react";
import { executeChat } from "@/lib/api";
import { Bot, Zap, Clock, Send, ShieldCheck, Loader2 } from "lucide-react";

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(
    "Hello! Hope you are doing well today. Important: Always return output in JSON format with keys status and summary. Do not output conversational preamble. Please process the following user data: Name: Alice Smith, Account ID: #99481, Action: Reset Password. Thank you very much!"
  );
  const [level, setLevel] = useState("high");
  const [preset, setPreset] = useState("general");

  const [responseCompressed, setResponseCompressed] = useState<any>(null);
  const [responseRaw, setResponseRaw] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunComparison = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      // Execute both compressed and raw prompt calls concurrently
      const [compRes, rawRes] = await Promise.all([
        executeChat(prompt, true, level, preset),
        executeChat(prompt, false, level, preset),
      ]);
      setResponseCompressed(compRes);
      setResponseRaw(rawRes);
    } catch (e: any) {
      setError(e.message || "Playground execution failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 border-brand-violet/30">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Bot className="w-6 h-6 text-brand-violet" />
          LLM Execution Playground: Compressed vs Raw Prompt
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Directly observe how prompt compression reduces latency and token usage without sacrificing LLM response quality or instruction following.
        </p>
      </div>

      {/* Input */}
      <div className="glass-panel p-5 space-y-4">
        <label className="text-sm font-semibold text-slate-200">Test Prompt Context</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full bg-dark-bg/80 border border-dark-border rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-violet/60"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-dark-bg border border-dark-border text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="low">Low Level (25%)</option>
              <option value="medium">Medium Level (50%)</option>
              <option value="high">High Level (72%)</option>
              <option value="extreme">Extreme Level (85%)</option>
            </select>
          </div>

          <button
            onClick={handleRunComparison}
            disabled={isLoading || !prompt.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-purple-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg flex items-center gap-2 text-xs transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Executing Dual LLM Comparison...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                Run Side-by-Side Test
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

      {/* Comparison Grid */}
      {(responseCompressed || responseRaw) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compressed Response Box */}
          <div className="glass-panel p-5 border-brand-cyan/40 bg-gradient-to-b from-brand-cyan/10 to-transparent space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-cyan" />
                <span className="text-sm font-bold text-cyan-300">With PromptSqueeze Compression</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ⚡ {responseCompressed?.latency_ms} ms
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[11px] text-slate-400">Effective Compressed Prompt Sent to LLM:</div>
              <div className="p-3 bg-dark-bg/90 rounded-lg border border-dark-border text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {responseCompressed?.effective_prompt}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[11px] text-cyan-300 font-semibold">LLM AI Response Output:</div>
              <div className="p-4 bg-dark-bg/90 rounded-lg border border-brand-cyan/30 text-cyan-100 min-h-[120px] whitespace-pre-wrap">
                {responseCompressed?.ai_response}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-dark-border">
              <span>Prompt Tokens: {responseCompressed?.usage?.prompt_tokens}</span>
              <span className="text-emerald-400 font-semibold">~{responseCompressed?.compression_result?.metrics?.compression_ratio}% token reduction</span>
            </div>
          </div>

          {/* Raw Response Box */}
          <div className="glass-panel p-5 border-slate-700 bg-gradient-to-b from-slate-800/40 to-transparent space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-slate-300">Raw Uncompressed Prompt</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                ⏱ {responseRaw?.latency_ms} ms
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[11px] text-slate-400">Raw Prompt Sent to LLM:</div>
              <div className="p-3 bg-dark-bg/90 rounded-lg border border-dark-border text-slate-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {responseRaw?.effective_prompt}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[11px] text-slate-300 font-semibold">LLM AI Response Output:</div>
              <div className="p-4 bg-dark-bg/90 rounded-lg border border-dark-border text-slate-200 min-h-[120px] whitespace-pre-wrap">
                {responseRaw?.ai_response}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-dark-border">
              <span>Prompt Tokens: {responseRaw?.usage?.prompt_tokens}</span>
              <span className="text-slate-500">Uncompressed baseline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
