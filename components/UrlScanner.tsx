"use client";

import React, { useState } from "react";
import { Search, Globe, ArrowRight, Loader2, Zap, ShoppingBag, Layers, ShieldAlert, CheckCircle2 } from "lucide-react";

interface UrlScannerProps {
  onScan: (url: string) => Promise<void>;
  isLoading: boolean;
}

const PRESET_URLS = [
  {
    name: "SaaS Dashboard & Billing",
    url: "https://stripe.com",
    category: "SaaS / Fintech",
    icon: Layers,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "E-Commerce Checkout Flow",
    url: "https://shop.app",
    category: "Retail / Cart",
    icon: ShoppingBag,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    name: "AI Web Application Portal",
    url: "https://vercel.com",
    category: "Developer Tools",
    icon: Zap,
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    name: "Security & Edge Probe App",
    url: "https://httpbin.org/forms/post",
    category: "Edge Cases",
    icon: ShieldAlert,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
];

export function UrlScanner({ onScan, isLoading }: UrlScannerProps) {
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    onScan(inputUrl.trim());
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
    onScan(url);
  };

  return (
    <div className="w-full">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>MiroFish Swarm Simulation for Web Applications</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Test Any Web App with a Swarm of{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Autonomous AI Bots
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Paste your website or web app URL. Our digital sandbox synthesizes dozens of AI personas—from
          elderly novices to adversarial boundary fuzzers—that autonomously navigate, fill forms, stress-test
          workflows, and uncover hidden UX friction before real users do.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 focus-within:border-cyan-500/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
          <div className="pl-3 pr-2 text-slate-400">
            <Globe className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste application URL (e.g. https://yourapp.vercel.app or my-site.com)"
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2 py-2"
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crawling...</span>
              </>
            ) : (
              <>
                <span>Deploy Swarm</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset Quick-Test Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
          Or test an instant preset application
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_URLS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset.url)}
                disabled={isLoading}
                className={`flex items-start space-x-3 p-3 rounded-xl border bg-slate-900/40 hover:bg-slate-800/60 transition-all text-left ${preset.color}`}
              >
                <div className="p-2 rounded-lg bg-slate-950/60 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-200 truncate">{preset.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{preset.url.replace("https://", "")}</p>
                  <span className="text-[10px] text-slate-500 mt-1 inline-block">{preset.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
