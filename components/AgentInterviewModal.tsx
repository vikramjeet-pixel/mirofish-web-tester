"use client";

import React, { useState } from "react";
import { AgentSimulationState, AppSurfaceData } from "@/types";
import {
  X,
  Send,
  MessageSquare,
  History,
  Info,
  Shield,
  Activity,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface AgentInterviewModalProps {
  state: AgentSimulationState;
  surface: AppSurfaceData;
  onClose: () => void;
}

interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  timestamp: number;
}

export function AgentInterviewModal({ state, surface, onClose }: AgentInterviewModalProps) {
  const { agent } = state;
  const [activeTab, setActiveTab] = useState<"chat" | "history" | "persona">("chat");
  const [inputQuery, setInputQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "agent",
      text: `Hello! I'm ${agent.name} (${agent.role}). I just tested ${surface.url} on ${agent.device}. Right now my status is "${state.status}" and frustration is at ${state.frustration}%. What would you like to know about my session?`,
      timestamp: Date.now(),
    },
  ]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuery).trim();
    if (!q || isSending) return;

    const userMsg: ChatMessage = { sender: "user", text: q, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsSending(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent,
          state,
          question: q,
          appUrl: surface.url,
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { sender: "agent", text: data.answer, timestamp: Date.now() },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "I encountered a minor cognitive delay while recalling my test run, but overall the friction on your app was very noticeable.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const SUGGESTED_PROMPTS = [
    "Why did you bounce?",
    "What was the most confusing part of the page?",
    "Did you spot any bugs or broken elements?",
    "What would make you convert?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-3xl rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden bg-[#0d1322]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{agent.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                  {agent.archetype}
                </span>
              </div>
              <p className="text-xs text-slate-400">{agent.role} &bull; {agent.device}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 border-b border-slate-800 flex space-x-6 text-xs font-semibold bg-slate-900/40">
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === "chat"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Interview Agent</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === "history"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Action Journey ({state.actionLog.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("persona")}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === "persona"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Full Persona Dossier</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === "chat" && (
            <div className="flex flex-col h-full space-y-4">
              {/* Message List */}
              <div className="space-y-3 min-h-[220px]">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-2.5 ${
                      m.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.sender === "agent" && (
                      <div className="text-xl p-1 bg-slate-800 rounded-lg shrink-0">
                        {agent.avatar}
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                        m.sender === "user"
                          ? "bg-cyan-600 text-white rounded-tr-none shadow-lg shadow-cyan-600/20"
                          : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>{agent.name} is formulating response...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="pt-2">
                <p className="text-[11px] text-slate-500 font-medium mb-2">Suggested Questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      disabled={isSending}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-3">
                Full chronological sequence of actions executed by {agent.name}:
              </p>
              {state.actionLog.map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs"
                >
                  <div className="mt-0.5">
                    {act.sentiment === "frustrated" ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : act.sentiment === "positive" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-200">{act.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Step #{state.actionLog.length - i}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{act.details}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                      Target: {act.targetElement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "persona" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Age & Literacy</span>
                  <span className="text-slate-200 font-bold mt-1 block">{agent.age} years old &bull; {agent.techLiteracy} Tech Literacy</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Testing Device</span>
                  <span className="text-slate-200 font-bold mt-1 block">{agent.device}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Behavioral Bias & Heuristic</span>
                <p className="text-slate-300 leading-relaxed">{agent.bias}</p>
              </div>

              {agent.adversarialTraits && agent.adversarialTraits.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-rose-400 block text-[10px] uppercase font-semibold mb-1.5 flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Adversarial Testing Vectors</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.adversarialTraits.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar (Only on Chat tab) */}
        {activeTab === "chat" && (
          <div className="p-4 border-t border-slate-800 bg-[#090e18]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask ${agent.name} about their experience...`}
                disabled={isSending}
                className="flex-1 bg-slate-900/90 text-xs sm:text-sm text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isSending || !inputQuery.trim()}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
