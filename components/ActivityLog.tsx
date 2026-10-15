"use client";

import React from "react";
import { AgentSimulationState } from "@/types";
import { Terminal, Activity, ArrowRight } from "lucide-react";

interface ActivityLogProps {
  states: AgentSimulationState[];
}

export function ActivityLog({ states }: ActivityLogProps) {
  // Aggregate recent actions from all agents
  const allEvents = states
    .flatMap((s) =>
      s.actionLog.map((act) => ({
        ...act,
        agentName: s.agent.name,
        agentAvatar: s.agent.avatar,
        agentId: s.agent.id,
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 40);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Live Swarm Execution Log</h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Real-Time Telemetry</span>
      </div>

      <div className="bg-[#050811] rounded-xl p-3 font-mono text-xs max-h-96 overflow-y-auto space-y-2 border border-slate-900">
        {allEvents.length === 0 ? (
          <p className="text-slate-600 italic">Awaiting swarm dispatch...</p>
        ) : (
          allEvents.map((evt, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
              <span className="text-slate-600 shrink-0">
                {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="shrink-0">{evt.agentAvatar}</span>
              <span className="text-cyan-400 font-semibold shrink-0">{evt.agentName}:</span>
              <span
                className={`font-semibold shrink-0 ${
                  evt.sentiment === "frustrated"
                    ? "text-rose-400"
                    : evt.sentiment === "positive"
                    ? "text-emerald-400"
                    : "text-amber-300"
                }`}
              >
                [{evt.action}]
              </span>
              <span className="text-slate-400 truncate">{evt.details}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
