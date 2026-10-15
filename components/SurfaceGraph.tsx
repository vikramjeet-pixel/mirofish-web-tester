"use client";

import React from "react";
import { AppSurfaceData, DiscoveredSurfaceNode } from "@/types";
import { Layout, MousePointer, FormInput, Link2, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface SurfaceGraphProps {
  surface: AppSurfaceData;
}

export function SurfaceGraph({ surface }: SurfaceGraphProps) {
  const getNodeIcon = (type: DiscoveredSurfaceNode["type"]) => {
    switch (type) {
      case "page":
        return <Layout className="w-4 h-4 text-cyan-400" />;
      case "button":
        return <MousePointer className="w-4 h-4 text-emerald-400" />;
      case "form":
      case "input":
        return <FormInput className="w-4 h-4 text-amber-400" />;
      case "link":
        return <Link2 className="w-4 h-4 text-indigo-400" />;
      default:
        return <Layout className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layout className="w-4 h-4 text-cyan-400" />
            <span>App Surface Topology Graph (MiroFish Reality Seed)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Discovered interactive DOM elements, navigable routes, and input surfaces
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
          {surface.surfaceNodes.length} Nodes Mapped
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {surface.surfaceNodes.map((node) => (
          <div
            key={node.id}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-slate-800">{getNodeIcon(node.type)}</div>
                <span className="text-xs font-bold text-white capitalize">{node.type}</span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  node.health === "healthy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : node.health === "warning"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {node.health}
              </span>
            </div>

            <p className="text-xs font-medium text-slate-200 mt-2 truncate">{node.label}</p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 truncate">{node.selector}</p>
          </div>
        ))}
      </div>

      {/* Security Headers Inspection */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
        <p className="font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security & Transport Resilience</span>
        </p>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div className="flex items-center space-x-1.5 text-slate-300">
            {surface.securityHeaders.hasHsts ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>HSTS Enforced</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            {surface.securityHeaders.hasXFrameOptions ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Clickjack Defense</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300">
            {surface.securityHeaders.hasCsp ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>CSP Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
