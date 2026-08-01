"use client";

import { Sliders, Code, MessageSquare, FileText, Sparkles, RefreshCw } from "lucide-react";

interface CompressionControlsProps {
  level: string;
  setLevel: (level: string) => void;
  preset: string;
  setPreset: (preset: string) => void;
  bypassCache: boolean;
  setBypassCache: (bypass: boolean) => void;
  onLoadSample: (sampleText: string, samplePreset: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = {
  general: `Hello! Hope you are doing well today. In this technical overview, we will outline our cloud platform architecture. Microservices architecture is an architectural style that structures an application as a collection of services. Microservices communicate over APIs. Each microservice is independently deployable and scalable. It is important to note that all microservice communication MUST use TLS 1.3 encryption. Never transmit unencrypted passwords or secret keys. API Gateway routes traffic to microservices. The rate limit is set to 100 requests per second. Always ensure rate limits are strictly enforced. API keys such as sk-live-9988776655443322 must be stored in Key Vault. Thank you!`,
  code: `import os\nimport sys\nimport json\nimport time\nimport os\nimport sys\n\n# Helper function to compute hash\ndef calculate_hash(data):\n    '''This function takes data and calculates hash.'''\n    # Convert data to string format\n    # Then use hashlib\n    import hashlib\n    # Single line comment describing hash\n    return hashlib.sha256(data.encode('utf-8')).hexdigest()\n\n# Main process data function\ndef process_data(input_file):\n    # Check if file exists\n    if not os.path.exists(input_file):\n        # Return error if file missing\n        return {'status': 'error', 'message': 'File not found'}\n    \n    # Read file contents\n    with open(input_file, 'r') as f:\n        content = f.read()\n        \n    # Process content\n    h = calculate_hash(content)\n    return {'status': 'success', 'hash': h}`,
  chat: `User: Hi there! Good morning! Hope you are having a wonderful day!\nAssistant: Hello! Good morning! I am doing great, thank you for asking. How can I help you today?\nUser: I am getting an HTTP 500 error when sending POST requests to https://api.myservice.com/v1/checkout.\nAssistant: Sure thing! I would be happy to help you debug this HTTP 500 error on your POST request. Can you tell me what body parameters you are passing?\nUser: I am passing user_id: 48291 and amount: 150.00.\nAssistant: Got it! Let me analyze this for you right away. As an AI language model, I recommend checking database connections and environment API keys like sk-test-12345. Make sure database timeout is configured to 30 seconds.`
};

export default function CompressionControls({
  level,
  setLevel,
  preset,
  setPreset,
  bypassCache,
  setBypassCache,
  onLoadSample,
  isLoading
}: CompressionControlsProps) {

  const levels = [
    { id: "low", label: "Low", ratio: "25%", desc: "Conservative (High fidelity)" },
    { id: "medium", label: "Medium", ratio: "50%", desc: "Balanced pruning" },
    { id: "high", label: "High", ratio: "72%", desc: "Target >70% reduction" },
    { id: "extreme", label: "Extreme", ratio: "85%", desc: "Minimalist context skeleton" },
  ];

  const presets = [
    { id: "general", label: "General Prompt", icon: FileText },
    { id: "code", label: "Codebase", icon: Code },
    { id: "chat", label: "Chat History", icon: MessageSquare },
  ];

  return (
    <div className="glass-panel p-5 space-y-5">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-cyan" />
            Adaptive Compression Strategy
          </h3>
          <p className="text-xs text-slate-400">Select target domain and compression aggressiveness</p>
        </div>

        {/* Preset Domain Tabs */}
        <div className="flex items-center gap-1.5 bg-dark-bg p-1 rounded-lg border border-dark-border">
          {presets.map((p) => {
            const Icon = p.icon;
            const isSelected = preset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-brand-cyan/20 text-cyan-300 border border-brand-cyan/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-dark-hover"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compression Level Selector */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Compression Level Intensity
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {levels.map((lvl) => {
            const isSelected = level === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setLevel(lvl.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-b from-brand-cyan/20 to-brand-violet/20 border-brand-cyan/60 text-slate-100 shadow-md shadow-brand-cyan/10"
                    : "bg-dark-bg/60 border-dark-border text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">{lvl.label}</span>
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-brand-cyan/30 text-cyan-200" : "bg-dark-border text-slate-400"
                  }`}>
                    {lvl.ratio}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{lvl.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Loader & Bypass Cache */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Load Hackathon Demo Sample:</span>
          <button
            onClick={() => onLoadSample(SAMPLE_PROMPTS.general, "general")}
            className="px-2.5 py-1 text-xs bg-dark-bg hover:bg-dark-hover border border-dark-border rounded-lg text-slate-300 flex items-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-400" /> General
          </button>
          <button
            onClick={() => onLoadSample(SAMPLE_PROMPTS.code, "code")}
            className="px-2.5 py-1 text-xs bg-dark-bg hover:bg-dark-hover border border-dark-border rounded-lg text-slate-300 flex items-center gap-1 transition-all"
          >
            <Code className="w-3 h-3 text-cyan-400" /> Code
          </button>
          <button
            onClick={() => onLoadSample(SAMPLE_PROMPTS.chat, "chat")}
            className="px-2.5 py-1 text-xs bg-dark-bg hover:bg-dark-hover border border-dark-border rounded-lg text-slate-300 flex items-center gap-1 transition-all"
          >
            <MessageSquare className="w-3 h-3 text-emerald-400" /> Chat
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={bypassCache}
            onChange={(e) => setBypassCache(e.target.checked)}
            className="rounded border-dark-border bg-dark-bg text-brand-cyan focus:ring-brand-cyan/40"
          />
          Bypass Semantic Cache
        </label>
      </div>
    </div>
  );
}
