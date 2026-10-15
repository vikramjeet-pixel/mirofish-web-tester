"use client";

import React, { useState } from "react";
import {
  AgentSimulationState,
  DiscoveredBug,
  AppSurfaceData,
  SimulationConfig,
} from "@/types";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Activity,
  Flame,
  Bug,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

interface LiveArenaProps {
  states: AgentSimulationState[];
  bugs: DiscoveredBug[];
  surface: AppSurfaceData;
  isPaused: boolean;
  tickCount: number;
  maxTicks: number;
  onTogglePause: () => void;
  onReset: () => void;
  onSelectAgent: (state: AgentSimulationState) => void;
}

export function LiveArena({
  states,
  bugs,
  surface,
  isPaused,
  tickCount,
  maxTicks,
  onTogglePause,
  onReset,
  onSelectAgent,
}: LiveArenaProps) {
  const [filter, setFilter] = useState<"all" | "active" | "bounced" | "converted" | "bugs">("all");

  const total = states.length;
  const converted = states.filter((s) => s.converted).length;
  const bounced = states.filter((s) => s.bounced).length;
  const active = states.filter((s) => !s.bounced && !s.converted).length;
  const avgFrustration = Math.round(states.reduce((acc, s) => acc + s.frustration, 0) / Math.max(1, total));

  const filteredStates = states.filter((s) => {
    if (filter === "active") return !s.bounced && !s.converted;
    if (filter === "bounced") return s.bounced;
    if (filter === "converted") return s.converted;
    if (filter === "bugs") return s.status === "bug_discovered" || s.bugsFound.length > 0;
    return true;
  });

  const progressPercent = Math.min(100, Math.round((tickCount / maxTicks) * 100));

  return (
    <div className="space-y-6">
      {/* Top Metrics Ticker */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${isPaused ? "bg-amber-500" : "bg-emerald-500 animate-ping-slow"}`}></span>
              <h2 className="text-xl font-bold text-white">Live Swarm Simulation Arena</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isPaused ? "Simulation Paused" : `Simulating ${total} autonomous user journeys on ${surface.title}`}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePause}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-700/60 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Real-time stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Active Bots</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{active}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Converted</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{converted}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Bounced / Lost</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-rose-400 mt-1">{bounced}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Frustration</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400 mt-1">{avgFrustration}%</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Bugs Triggered</span>
              <Bug className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-rose-400 mt-1">{bugs.length}</p>
          </div>
        </div>

        {/* Simulation Progress bar */}
        <div className="mt-4 pt-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Simulation Cycle: Tick {tickCount} of {maxTicks}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          {[
            { id: "all", label: `All (${total})` },
            { id: "active", label: `Active (${active})` },
            { id: "bounced", label: `Bounced (${bounced})` },
            { id: "converted", label: `Converted (${converted})` },
            { id: "bugs", label: `Bug Hunters (${bugs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filter === tab.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          💡 Click any bot to open <span className="text-cyan-400 font-semibold">Agent Interrogation / Interview</span>
        </p>
      </div>

      {/* Swarm Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStates.map((state) => {
          const { agent } = state;
          const isHighFrustration = state.frustration >= 60;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(state)}
              className="glass-card glass-card-hover rounded-2xl p-4 border border-slate-800/80 cursor-pointer relative overflow-hidden group shadow-lg"
            >
              {/* Status accent indicator */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  state.converted
                    ? "bg-emerald-500"
                    : state.bounced
                    ? "bg-rose-500"
                    : state.status === "rage_clicking"
                    ? "bg-amber-500 animate-pulse"
                    : state.status === "bug_discovered"
                    ? "bg-purple-500"
                    : "bg-cyan-500"
                }`}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{agent.role}</p>
                  </div>
                </div>

                {/* Status Pill */}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    state.converted
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : state.bounced
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : state.status === "rage_clicking"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : state.status === "bug_discovered"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                      : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  }`}
                >
                  {state.status.replace("_", " ")}
                </span>
              </div>

              {/* Device and literacy tags */}
              <div className="flex items-center space-x-2 mt-3 text-[10px] text-slate-400">
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {agent.device}
                </span>
                <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Lit: {agent.techLiteracy}
                </span>
              </div>

              {/* Live Thought Bubble */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider mb-1 flex items-center justify-between">
                  <span>Current Thought</span>
                  <Activity className="w-3 h-3 text-cyan-400" />
                </p>
                <p className="text-slate-300 line-clamp-2 italic text-[11px]">
                  &ldquo;{state.recentThought}&rdquo;
                </p>
              </div>

              {/* Frustration & Completion Gauges */}
              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-500">Frustration:</span>
                  <span
                    className={`font-bold ${
                      isHighFrustration ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {state.frustration}%
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-cyan-400 group-hover:translate-x-0.5 transition font-semibold">
                  <span>Interview</span>
                  <MessageSquare className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
