"use client";

import React, { useState } from "react";
import { IntelligenceReportData, DiscoveredBug } from "@/types";
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Code,
} from "lucide-react";

interface IntelligenceReportProps {
  report: IntelligenceReportData;
}

export function IntelligenceReport({ report }: IntelligenceReportProps) {
  const [copied, setCopied] = useState(false);
  const [expandedBugId, setExpandedBugId] = useState<string | null>(null);

  const getSeverityBadge = (sev: DiscoveredBug["severity"]) => {
    switch (sev) {
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40";
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    }
  };

  const generateMarkdown = () => {
    return `# MiroFish Swarm QA & UX Prediction Report
Target: ${report.appUrl}
Generated: ${new Date().toISOString()}

## Executive Summary
- Overall Usability Score: ${report.overallScore}/100
- Predicted Conversion: ${report.conversionPrediction}%
- Security Grade: ${report.securityGrade}
- Accessibility Score: ${report.accessibilityScore}/100
- Critical Drop-off Bottleneck: ${report.criticalDropoffNode}

${report.swarmSummary}

## Discovered Bugs & Anomalies (${report.discoveredBugs.length})
${report.discoveredBugs
  .map(
    (b, i) => `### ${i + 1}. [${b.severity.toUpperCase()}] ${b.title}
- Discovered by: ${b.discoveredByAgent}
- Affected Element: \`${b.elementSelector}\`
- Impact: ${b.impact}
- Reproduction Steps:
${b.reproductionSteps.map((s) => `  ${s}`).join("\n")}
- Suggested Fix:
  \`\`\`
  ${b.suggestedFix}
  \`\`\`
`
  )
  .join("\n")}

## Recommended Actions
${report.recommendations
  .map(
    (r, i) => `### ${i + 1}. [${r.priority.toUpperCase()}] ${r.title}
${r.explanation}

\`\`\`tsx
${r.fixSnippet}
\`\`\`
`
  )
  .join("\n")}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mirofish-qa-report-${new URL(report.appUrl).hostname}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white">MiroFish Swarm QA & Usability Report</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono truncate max-w-xl">
            Target: {report.appUrl} &bull; Generated from multi-agent emergent sandbox
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Report"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium">Usability Index</p>
          <p className="text-4xl font-extrabold text-cyan-400 mt-2">{report.usabilityIndex}/100</p>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Heuristic UX Health</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium">Predicted Conversion</p>
          <p className="text-4xl font-extrabold text-emerald-400 mt-2">{report.conversionPrediction}%</p>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Swarm Funnel Reach</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium">Security Resilience</p>
          <p className="text-4xl font-extrabold text-purple-400 mt-2">Grade {report.securityGrade}</p>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Boundary & Input Defense</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
          <p className="text-xs text-slate-400 font-medium">Accessibility (WCAG)</p>
          <p className="text-4xl font-extrabold text-blue-400 mt-2">{report.accessibilityScore}/100</p>
          <span className="text-[10px] text-slate-500 mt-1 inline-block">Contrast & Tab Navigation</span>
        </div>
      </div>

      {/* Synthesis Narrative */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Swarm Emergence Synthesis</span>
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{report.swarmSummary}</p>
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-slate-300">
            <strong className="text-rose-300">Primary Conversion Chokepoint:</strong> Most bot drop-offs
            occurred at <span className="font-mono text-white underline">{report.criticalDropoffNode}</span>.
          </span>
        </div>
      </div>

      {/* Discovered Bugs Accordion */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bug className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Discovered Bugs & Friction Anomalies ({report.discoveredBugs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ranked by Severity</span>
        </div>

        {report.discoveredBugs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No critical bugs discovered during this simulation cycle.
          </div>
        ) : (
          <div className="space-y-3">
            {report.discoveredBugs.map((bug) => {
              const isExpanded = expandedBugId === bug.id;
              return (
                <div
                  key={bug.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition"
                >
                  <div
                    onClick={() => setExpandedBugId(isExpanded ? null : bug.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{bug.agentAvatar}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getSeverityBadge(
                              bug.severity
                            )}`}
                          >
                            {bug.severity}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{bug.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Discovered by {bug.discoveredByAgent} &bull; Selector:{" "}
                          <span className="font-mono text-cyan-400">{bug.elementSelector}</span>
                        </p>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3 text-xs">
                      <div>
                        <strong className="text-slate-300 block mb-1">Issue Description:</strong>
                        <p className="text-slate-400 leading-relaxed">{bug.description}</p>
                      </div>

                      <div>
                        <strong className="text-slate-300 block mb-1">Reproduction Steps:</strong>
                        <div className="space-y-1 font-mono text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          {bug.reproductionSteps.map((step, idx) => (
                            <p key={idx}>{step}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <strong className="text-emerald-400 block mb-1 flex items-center space-x-1">
                          <Code className="w-3.5 h-3.5" />
                          <span>Suggested Engineering Fix:</span>
                        </strong>
                        <p className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                          {bug.suggestedFix}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prioritized Engineering Recommendations */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Prioritized Engineering & UX Action Items</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                Priority: {rec.priority}
              </span>
              <h5 className="font-bold text-white text-xs">{rec.title}</h5>
              <p className="text-slate-400 text-[11px] leading-relaxed">{rec.explanation}</p>
              <pre className="p-2 rounded bg-slate-950 text-emerald-300 text-[10px] font-mono overflow-x-auto border border-slate-800">
                {rec.fixSnippet}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
