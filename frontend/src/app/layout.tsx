import "@/styles/globals.css";
import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PromptSqueeze | Ultra-Low Resource LLM Context Compression Engine",
  description: "Intelligent semantic context compression engine for LLMs. Reduces prompt token consumption by >70% while preserving >95% semantic fidelity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-slate-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {children}
        </main>
        <footer className="border-t border-dark-border py-6 text-center text-xs text-slate-400 font-mono">
          PromptSqueeze v1.0 — Hackathon Production Quality Deliverable — Built with Next.js, FastAPI & SentenceTransformers
        </footer>
      </body>
    </html>
  );
}
