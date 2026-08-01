"use client";

import { useState } from "react";
import { runBenchmarkSuite } from "@/lib/api";
import { Play, BarChart3, TrendingDown, DollarSign, Clock, CheckCircle, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function AnalyticsPage() {
  const [level, setLevel] = useState("high");
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunBenchmark = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await runBenchmarkSuite(level);
      setBenchmarkResult(data);
    } catch (e: any) {
      setError(e.message || "Benchmark failed");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = benchmarkResult?.individual_results?.map((r: any) => ({
    name: r.name,
    originalTokens: r.original_tokens,
    compressedTokens: r.compressed_tokens,
    compressionRatio: r.compression_ratio,
    similarity: Math.round(r.semantic_similarity * 100),
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-cyan" />
            Automated Benchmark & Analytics Suite
          </h1>
          <p className="text-xs text-slate-400">
            Evaluate compression engine efficiency across standard prompt datasets (Docs, Code, Chat, Logs)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="bg-dark-bg border border-dark-border text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-cyan"
          >
            <option value="low">Low Intensity (25%)</option>
            <option value="medium">Medium Intensity (50%)</option>
            <option value="high">High Intensity (72%)</option>
            <option value="extreme">Extreme Intensity (85%)</option>
          </select>

          <button
            onClick={handleRunBenchmark}
            disabled={isLoading}
            className="px-5 py-2.5 bg-brand-cyan hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-brand-cyan/20 flex items-center gap-2 text-xs transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Evaluating Benchmark Suite...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-slate-950" />
                Run Benchmark Suite
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

      {benchmarkResult ? (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 border-brand-cyan/30">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Compression</span>
              <div className="text-3xl font-extrabold text-brand-cyan font-mono my-1">
                {benchmarkResult.overall_compression_percentage}%
              </div>
              <p className="text-xs text-slate-400">
                {benchmarkResult.total_original_tokens} → {benchmarkResult.total_compressed_tokens} total tokens
              </p>
            </div>

            <div className="glass-panel p-4 border-brand-amber/30">
              <span className="text-xs font-semibold text-slate-400 uppercase">Avg Semantic Similarity</span>
              <div className="text-3xl font-extrabold text-brand-amber font-mono my-1">
                {Math.round(benchmarkResult.avg_semantic_similarity * 100)}%
              </div>
              <p className="text-xs text-slate-400">Cosine score: {benchmarkResult.avg_semantic_similarity}</p>
            </div>

            <div className="glass-panel p-4 border-brand-emerald/30">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Cost Saved</span>
              <div className="text-3xl font-extrabold text-brand-emerald font-mono my-1">
                ${benchmarkResult.total_cost_saved_usd.toFixed(5)}
              </div>
              <p className="text-xs text-slate-400">Across test dataset</p>
            </div>

            <div className="glass-panel p-4 border-brand-violet/30">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Latency Saved</span>
              <div className="text-3xl font-extrabold text-brand-violet font-mono my-1">
                {benchmarkResult.total_latency_saved_ms} ms
              </div>
              <p className="text-xs text-slate-400">Benchmarked in {benchmarkResult.total_benchmark_execution_ms} ms</p>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Token Reduction Comparison Across Benchmark Prompts</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", borderColor: "#374151", color: "#F3F4F6", borderRadius: "8px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar dataKey="originalTokens" name="Original Tokens" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="compressedTokens" name="Compressed Tokens" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Individual Results Table */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">Individual Benchmark Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-dark-border text-slate-400 font-sans">
                    <th className="py-2.5 px-3">Benchmark Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Tokens (Orig → Comp)</th>
                    <th className="py-2.5 px-3">Reduction %</th>
                    <th className="py-2.5 px-3">Similarity</th>
                    <th className="py-2.5 px-3">Cost Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {benchmarkResult.individual_results.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-dark-hover/50 text-slate-200">
                      <td className="py-3 px-3 font-semibold">{r.name}</td>
                      <td className="py-3 px-3 uppercase text-[10px] text-slate-400">{r.category}</td>
                      <td className="py-3 px-3">{r.original_tokens} → {r.compressed_tokens}</td>
                      <td className="py-3 px-3 text-brand-cyan font-bold">{r.compression_ratio}%</td>
                      <td className="py-3 px-3 text-amber-400">{Math.round(r.semantic_similarity * 100)}%</td>
                      <td className="py-3 px-3 text-emerald-400">${r.cost_saved_usd.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 text-center text-slate-400 text-xs space-y-3">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto" />
          <p>Click <strong>"Run Benchmark Suite"</strong> above to evaluate compression performance.</p>
        </div>
      )}
    </div>
  );
}
