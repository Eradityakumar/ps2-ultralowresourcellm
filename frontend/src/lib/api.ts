const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CompressMetrics {
  original_tokens: number;
  compressed_tokens: number;
  saved_tokens: number;
  compression_ratio: number;
  cost_saved_usd: number;
  latency_saved_ms: number;
}

export interface SentenceMapItem {
  text: string;
  status: "preserved" | "removed_duplicate" | "pruned_low_importance" | "pruned_comment" | "pruned_greeting_filler" | "pruned_empty_line";
  score: number;
  reasons: string[];
  is_instruction?: boolean;
}

export interface CompressResponse {
  original_prompt: string;
  compressed_prompt: string;
  fingerprint_sha256: string;
  is_cache_hit: boolean;
  cache_match_type?: string;
  metrics: CompressMetrics;
  semantic_similarity_score: number;
  compression_level: string;
  preset_type: string;
  strategy_used: string;
  execution_time_ms: number;
  sentence_map: SentenceMapItem[];
}

export async function compressPrompt(
  prompt: string,
  level: string = "high",
  preset: string = "general",
  bypassCache: boolean = false
): Promise<CompressResponse> {
  const res = await fetch(`${API_BASE}/compress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, level, preset, bypass_cache: bypassCache }),
  });
  if (!res.ok) {
    throw new Error(`Compression API error: ${res.statusText}`);
  }
  return res.json();
}

export async function analyzePrompt(
  prompt: string,
  level: string = "high",
  preset: string = "general"
) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, level, preset }),
  });
  if (!res.ok) {
    throw new Error(`Analyze API error: ${res.statusText}`);
  }
  return res.json();
}

export async function executeChat(
  prompt: string,
  useCompression: boolean = true,
  level: string = "high",
  preset: string = "general"
) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, use_compression: useCompression, level, preset }),
  });
  if (!res.ok) {
    throw new Error(`Chat API error: ${res.statusText}`);
  }
  return res.json();
}

export async function runBenchmarkSuite(level: string = "high") {
  const res = await fetch(`${API_BASE}/benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level }),
  });
  if (!res.ok) {
    throw new Error(`Benchmark API error: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) {
    throw new Error(`History API error: ${res.statusText}`);
  }
  return res.json();
}
