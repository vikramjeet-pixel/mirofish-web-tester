"use client";

import React from "react";
import { AppSurfaceData, SimulationConfig } from "@/types";
import { Users, Shield, Zap, Sparkles, Check, ArrowRight, Server, Compass, Layout } from "lucide-react";

interface SwarmConfigProps {
  surface: AppSurfaceData;
  config: SimulationConfig;
  onChangeConfig: (config: SimulationConfig) => void;
  onStartSimulation: () => void;
}

export function SwarmConfig({ surface, config, onChangeConfig, onStartSimulation }: SwarmConfigProps) {
  const toggleFocus = (area: "forms" | "navigation" | "accessibility" | "security" | "performance") => {
    const exists = config.focusAreas.includes(area);
    const updated = exists
      ? config.focusAreas.filter((a) => a !== area)
      : [...config.focusAreas, area];
    onChangeConfig({ ...config, focusAreas: updated });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* App Surface Discovery Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-lg font-bold text-white truncate max-w-md">{surface.title}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono truncate">{surface.url}</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className="text-slate-500 mr-1.5">Latency:</span>
              <span className="font-semibold text-cyan-400">{surface.latencyMs}ms</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <span className="text-slate-500 mr-1.5">Framework:</span>
              <span className="font-semibold text-emerald-400">{surface.detectedFramework}</span>
            </div>
          </div>
        </div>

        {/* Surface nodes overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <p className="text-[11px] text-slate-500 font-medium">Discovered Buttons</p>
            <p className="text-xl font-bold text-cyan-400 mt-0.5">{surface.interactiveElements.buttons.length}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <p className="text-[11px] text-slate-500 font-medium">Input Fields</p>
            <p className="text-xl font-bold text-blue-400 mt-0.5">{surface.interactiveElements.inputs.length}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <p className="text-[11px] text-slate-500 font-medium">Nav Links</p>
            <p className="text-xl font-bold text-indigo-400 mt-0.5">{surface.interactiveElements.links.length}</p>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
            <p className="text-[11px] text-slate-500 font-medium">Surface Nodes</p>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{surface.surfaceNodes.length}</p>
          </div>
        </div>
      </div>

      {/* Swarm Parameters */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Configure Swarm Parameters</h3>
        </div>

        {/* Swarm Size */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Swarm Population (Concurrent Autonomous Agents)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChangeConfig({ ...config, swarmSize: size })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                  config.swarmSize === size
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 font-bold"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {size} Bots
              </button>
            ))}
          </div>
        </div>

        {/* Adversarial Intensity */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Adversarial & Chaos Intensity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "low", label: "Standard Users", desc: "Typical organic traffic" },
              { id: "medium", label: "Elevated Stress", desc: "Speedrunners & Rage-clickers" },
              { id: "chaos", label: "Chaos Monkey", desc: "Aggressive payload fuzzer" },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => onChangeConfig({ ...config, adversarialIntensity: tier.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.adversarialIntensity === tier.id
                    ? "bg-blue-600/20 border-blue-500 text-blue-200 shadow-md shadow-blue-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <p className="text-xs font-bold text-white">{tier.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{tier.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            Testing Focus Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "forms", label: "Forms & Inputs" },
              { id: "navigation", label: "Navigation & Funnels" },
              { id: "accessibility", label: "WCAG Accessibility" },
              { id: "security", label: "Security & Fuzzing" },
              { id: "performance", label: "Latency & Responsiveness" },
            ].map((area) => {
              const active = config.focusAreas.includes(area.id as any);
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => toggleFocus(area.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    active
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium"
                      : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={onStartSimulation}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Swarm Simulation ({config.swarmSize} Agents)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
