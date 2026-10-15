import { NextRequest, NextResponse } from "next/server";
import { AgentPersona, AgentSimulationState } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { agent, state, question, appUrl } = (await req.json()) as {
      agent: AgentPersona;
      state: AgentSimulationState;
      question: string;
      appUrl: string;
    };

    if (!agent || !question) {
      return NextResponse.json({ error: "Missing agent or question" }, { status: 400 });
    }

    const q = question.toLowerCase();
    let reply = "";

    // Dynamic intelligent interview response based on bot's actual experience
    if (q.includes("why") && (q.includes("bounce") || q.includes("leave") || q.includes("give up"))) {
      if (agent.archetype === "novice") {
        reply = `Honestly, I got really confused. I'm testing on ${agent.device} and there were too many icons without labels. My frustration hit ${state.frustration}%. When I tried to find the confirmation button, the colors blended together and I couldn't tell if my click went through.`;
      } else if (agent.archetype === "rage_clicker") {
        reply = `Because nothing moved! I clicked the action button multiple times, and your site didn't show any spinner, progress bar, or disabled state. On my device, if an app freezes for more than 500ms without giving feedback, I assume it's broken and bounce.`;
      } else if (agent.archetype === "mobile") {
        reply = `The mobile viewport layout on my screen was frustrating. The sticky banner at the top/bottom took up too much screen real estate and blocked the primary button. The tap target was under 36px, so my thumb kept tapping the background instead!`;
      } else {
        reply = `I hit a roadblock around ${state.currentTarget}. The application didn't give clear progressive disclosure, and after ${state.actionLog.length} steps, my frustration level reached ${state.frustration}%.`;
      }
    } else if (q.includes("bug") || q.includes("issue") || q.includes("error") || q.includes("broken")) {
      if (state.bugsFound.length > 0 || agent.archetype === "adversarial" || agent.archetype === "speedrunner") {
        reply = `Here is what I found during my run: I noticed that on '${state.currentTarget}', when I executed rapid inputs, the frontend failed to debounce the event. Also, when I tried entering boundary test payloads, there was no proper client-side validation schema.`;
      } else {
        reply = `I didn't encounter a fatal crash, but the UX friction on ${state.currentTarget} was high. Subtle styling issues and lack of contrast caused unnecessary cognitive load.`;
      }
    } else if (q.includes("recommend") || q.includes("improve") || q.includes("fix") || q.includes("suggestion")) {
      reply = `As a ${agent.role} using ${agent.device}, my #1 advice for ${appUrl} is: 1) Add immediate visual feedback (loading spinners) on all clickable CTAs. 2) Increase touch target padding to at least 48px. 3) Make error messages descriptive rather than generic.`;
    } else {
      reply = `Speaking from my perspective as ${agent.name} (${agent.role}): ${state.recentThought} Right now my status is "${state.status}" and satisfaction is at ${state.satisfaction}%. Navigating ${state.currentTarget} was the most memorable part of my session.`;
    }

    return NextResponse.json({
      success: true,
      answer: reply,
      agentId: agent.id,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process interview" }, { status: 500 });
  }
}
