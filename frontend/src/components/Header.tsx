"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BarChart3, Bot, FileText, Cpu } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Compressor Studio", icon: Zap },
    { href: "/analytics", label: "Analytics & Benchmarks", icon: BarChart3 },
    { href: "/playground", label: "LLM Playground", icon: Bot },
    { href: "/docs", label: "Docs & Pitch Deck", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-cyan via-brand-violet to-brand-emerald p-0.5 shadow-lg shadow-brand-cyan/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-brand-cyan group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-brand-cyan bg-clip-text text-transparent">
                PromptSqueeze
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-violet/20 text-brand-violet border border-brand-violet/30 rounded-full">
                v1.0 Hackathon Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Ultra-Low Resource LLM Compression</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-dark-card/60 p-1.5 rounded-xl border border-dark-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-brand-cyan/20 to-brand-violet/20 text-cyan-300 border border-brand-cyan/40 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-dark-hover"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          MiniLM Engine Active
        </div>
      </div>
    </header>
  );
}
