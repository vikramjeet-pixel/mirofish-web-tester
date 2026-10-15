"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { UrlScanner } from "@/components/UrlScanner";
import { SwarmConfig } from "@/components/SwarmConfig";
import { LiveArena } from "@/components/LiveArena";
import { SurfaceGraph } from "@/components/SurfaceGraph";
import { ActivityLog } from "@/components/ActivityLog";
import { IntelligenceReport } from "@/components/IntelligenceReport";
import { AgentInterviewModal } from "@/components/AgentInterviewModal";
import {
  AppSurfaceData,
  SimulationConfig,
  AgentPersona,
  AgentSimulationState,
  DiscoveredBug,
  IntelligenceReportData,
} from "@/types";
import { generateSwarm } from "@/lib/persona-generator";
import {
  initializeSimulation,
  stepSimulationTick,
  generateIntelligenceReport,
} from "@/lib/simulation-engine";
import {
  Activity,
  Layout,
  Terminal,
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [stage, setStage] = useState<"input" | "config" | "running">("input");
  const [isLoadingSurface, setIsLoadingSurface] = useState(false);
  const [surface, setSurface] = useState<AppSurfaceData | null>(null);

  const [config, setConfig] = useState<SimulationConfig>({
    targetUrl: "",
    swarmSize: 25,
    adversarialIntensity: "medium",
    testDepth: "deep",
    focusAreas: ["forms", "navigation", "accessibility", "security"],
  });

  const [agents, setAgents] = useState<AgentPersona[]>([]);
  const [states, setStates] = useState<AgentSimulationState[]>([]);
  const [bugs, setBugs] = useState<DiscoveredBug[]>([]);
  const [tickCount, setTickCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [report, setReport] = useState<IntelligenceReportData | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentSimulationState | null>(null);
  const [activeTab, setActiveTab] = useState<"arena" | "topology" | "terminal" | "report">("arena");

  const MAX_TICKS = 8;
  const isRunningRef = useRef(false);

  // 1. Scan target URL
  const handleScanUrl = async (url: string) => {
    setIsLoadingSurface(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.surface) {
        setSurface(data.surface);
        setConfig((prev) => ({ ...prev, targetUrl: url }));
        setStage("config");
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setIsLoadingSurface(false);
    }
  };

  // 2. Launch Swarm
  const handleStartSimulation = () => {
    if (!surface) return;
    const swarm = generateSwarm(config);
    const initialStates = initializeSimulation(swarm, surface);

    setAgents(swarm);
    setStates(initialStates);
    setBugs([]);
    setTickCount(1);
    setIsPaused(false);
    setReport(null);
    setStage("running");
    setActiveTab("arena");
    isRunningRef.current = true;
  };

  // 3. Ticking loop
  useEffect(() => {
    if (stage !== "running" || isPaused || tickCount >= MAX_TICKS || !surface) return;

    const timer = setTimeout(() => {
      setStates((currentStates) => {
        const { updatedStates, newBugs, isFinished } = stepSimulationTick(
          currentStates,
          surface,
          config,
          tickCount,
          bugs
        );

        if (newBugs.length > 0) {
          setBugs((prev) => [...prev, ...newBugs]);
        }

        const nextTick = tickCount + 1;
        setTickCount(nextTick);

        if (nextTick >= MAX_TICKS || isFinished) {
          isRunningRef.current = false;
          // Generate final report
          const finalReport = generateIntelligenceReport(
            surface,
            updatedStates,
            [...bugs, ...newBugs]
          );
          setReport(finalReport);
        }

        return updatedStates;
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [stage, isPaused, tickCount, surface, config, bugs]);

  const handleReset = () => {
    setStage("input");
    setSurface(null);
    setStates([]);
    setBugs([]);
    setReport(null);
    setTickCount(0);
    setIsPaused(false);
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stage === "input" && (
          <div className="py-8 sm:py-16">
            <UrlScanner onScan={handleScanUrl} isLoading={isLoadingSurface} />
          </div>
        )}

        {stage === "config" && surface && (
          <div className="py-6">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setStage("input")}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <span>&larr; Back to URL Scanner</span>
              </button>
            </div>
            <SwarmConfig
              surface={surface}
              config={config}
              onChangeConfig={setConfig}
              onStartSimulation={handleStartSimulation}
            />
          </div>
        )}

        {stage === "running" && surface && (
          <div className="space-y-6">
            {/* View navigation bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base">Target:</span>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 truncate max-w-xs sm:max-w-md">
                  {surface.url}
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("arena")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeTab === "arena"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Swarm Arena</span>
                </button>

                <button
                  onClick={() => setActiveTab("topology")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeTab === "topology"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>App Topology</span>
                </button>

                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeTab === "terminal"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Telemetry Feed</span>
                </button>

                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                    activeTab === "report"
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Report {report && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-0.5"></span>}</span>
                </button>
              </div>
            </div>

            {/* Active Tab Views */}
            {activeTab === "arena" && (
              <LiveArena
                states={states}
                bugs={bugs}
                surface={surface}
                isPaused={isPaused}
                tickCount={tickCount}
                maxTicks={MAX_TICKS}
                onTogglePause={() => setIsPaused((p) => !p)}
                onReset={handleReset}
                onSelectAgent={(agentState) => setSelectedAgent(agentState)}
              />
            )}

            {activeTab === "topology" && <SurfaceGraph surface={surface} />}

            {activeTab === "terminal" && <ActivityLog states={states} />}

            {activeTab === "report" && (
              <>
                {report ? (
                  <IntelligenceReport report={report} />
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-4">
                    <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
                    <h3 className="text-lg font-bold text-white">Synthesizing Swarm Report...</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Simulation is currently at Tick {tickCount} of {MAX_TICKS}. Full executive QA
                      synthesis will finalize once all agents complete their exploration runs.
                    </p>
                    <button
                      onClick={() => {
                        const immediateReport = generateIntelligenceReport(surface, states, bugs);
                        setReport(immediateReport);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
                    >
                      Generate Intermediate Report Now
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Agent Interview Modal (Signature MiroFish Feature) */}
      {selectedAgent && surface && (
        <AgentInterviewModal
          state={selectedAgent}
          surface={surface}
          onClose={() => setSelectedAgent(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 mt-12 bg-[#050811] text-center text-xs text-slate-500">
        <p>
          MiroFish Web Swarm Engine &bull; Autonomous Multi-Agent UX &amp; QA Intelligence Sandbox
        </p>
      </footer>
    </div>
  );
}
