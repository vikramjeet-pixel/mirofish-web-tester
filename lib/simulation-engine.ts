import {
  AgentSimulationState,
  AgentPersona,
  AppSurfaceData,
  DiscoveredBug,
  IntelligenceReportData,
  SimulationConfig,
  AgentAction,
} from "@/types";

export function initializeSimulation(
  agents: AgentPersona[],
  surface: AppSurfaceData
): AgentSimulationState[] {
  return agents.map((agent) => ({
    agent,
    status: "exploring",
    frustration: Math.floor(Math.random() * 15),
    satisfaction: 85,
    currentAction: "Inspecting landing page viewport",
    currentTarget: surface.surfaceNodes[0]?.label || "Root Viewport",
    recentThought: `Scanning hero section and checking layout on ${agent.device}...`,
    actionLog: [
      {
        timestamp: Date.now(),
        action: "INITIAL_LOAD",
        targetElement: "body",
        details: `Loaded ${surface.url} in ${surface.latencyMs}ms on ${agent.device}`,
        sentiment: "neutral",
      },
    ],
    bugsFound: [],
    converted: false,
    bounced: false,
    completionPercentage: 10,
  }));
}

export function stepSimulationTick(
  states: AgentSimulationState[],
  surface: AppSurfaceData,
  config: SimulationConfig,
  tickCount: number,
  existingBugs: DiscoveredBug[]
): {
  updatedStates: AgentSimulationState[];
  newBugs: DiscoveredBug[];
  isFinished: boolean;
} {
  const newBugs: DiscoveredBug[] = [];
  const nodes = surface.surfaceNodes;

  const updatedStates = states.map((state) => {
    // If agent already bounced or converted, state remains settled
    if (state.bounced || state.converted) {
      return state;
    }

    const { agent } = state;
    const currentStep = Math.min(100, state.completionPercentage + Math.floor(Math.random() * 20) + 10);
    let newFrustration = state.frustration;
    let newSatisfaction = state.satisfaction;
    let newStatus = state.status;
    let actionName = "NAVIGATE";
    let target = state.currentTarget;
    let thought = state.recentThought;
    let sentiment: "positive" | "neutral" | "negative" | "frustrated" = "neutral";
    let details = "";

    // Pick random relevant node
    const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    target = randomNode ? randomNode.label : "Interactive Component";

    // Archetype-driven logic
    if (agent.archetype === "novice") {
      if (Math.random() > 0.45) {
        newFrustration += 18;
        newStatus = "confused";
        actionName = "LOST_IN_NAVIGATION";
        thought = "Where is the submit button? The text contrast is too low and there are too many competing animations.";
        sentiment = "frustrated";
        details = "User circled cursor 4 times over navbar looking for explicit confirmation.";
      } else {
        actionName = "CLICK";
        thought = "Found the primary button. Reading the disclaimer text carefully.";
        sentiment = "neutral";
        details = `Clicked ${target} with standard pointer.`;
      }
    } else if (agent.archetype === "speedrunner") {
      actionName = "KEYBOARD_TAB_ENTER";
      details = "Sent Tab + Tab + Enter in 140ms. Fired submit before input blur handler resolved.";
      thought = "Navigating at maximum speed. Testing rapid keyboard shortcuts...";
      if (tickCount >= 2 && Math.random() > 0.6) {
        // Find race condition bug
        const bugId = `BUG-RACE-${agent.id}`;
        if (!existingBugs.some((b) => b.id.includes("RACE")) && !newBugs.some((b) => b.id.includes("RACE"))) {
          newBugs.push({
            id: bugId,
            title: "Async Race Condition: Double Form Submission",
            severity: "high",
            category: "functional",
            elementSelector: randomNode?.selector || "form button[type='submit']",
            description: "Rapidly pressing Enter or double-clicking the CTA before debounce fires triggers two concurrent requests, causing duplicate records.",
            reproductionSteps: [
              "1. Focus the primary input",
              "2. Press 'Tab' then hit 'Enter' twice within 100ms",
              "3. Inspect Network tab: 2 POST requests dispatched with identical payloads",
            ],
            discoveredByAgent: agent.name,
            agentAvatar: agent.avatar,
            suggestedFix: "Disable submit button immediately on first submit or wrap handler in a debounce / AbortController guard.",
            impact: "Creates duplicate database rows and potential double-billing.",
          });
          newStatus = "bug_discovered";
          thought = "BAM! Triggered a race condition on rapid submit. No debounce on the button handler!";
        }
      }
    } else if (agent.archetype === "adversarial") {
      actionName = "INJECT_PAYLOAD";
      const payloads = [
        "<script>alert(document.domain)</script>",
        "' OR '1'='1' --",
        "../../etc/passwd",
        "-9999999",
        "A".repeat(4096),
      ];
      const payload = payloads[Math.floor(Math.random() * payloads.length)];
      details = `Pasted test string: \`${payload.slice(0, 25)}\` into ${target}`;
      thought = `Fuzzing input fields with boundary payload: ${payload.slice(0, 18)}...`;

      if (tickCount >= 3 && Math.random() > 0.5) {
        const bugId = `BUG-SEC-${agent.id}`;
        if (!existingBugs.some((b) => b.id.includes("SEC")) && !newBugs.some((b) => b.id.includes("SEC"))) {
          newBugs.push({
            id: bugId,
            title: "Unsanitized Input Reflection / Client DOM Overflow",
            severity: "critical",
            category: "security",
            elementSelector: "input, textarea",
            description: "Target accepts boundary test inputs (HTML entities, oversized strings) without strict client-side validation, risking UI crash or XSS reflection.",
            reproductionSteps: [
              "1. Locate search or email input",
              "2. Paste 4,000+ unicode characters or `<img src=x onerror=console.warn('test')>`",
              "3. Form renders unescaped string into DOM or overflows container layout",
            ],
            discoveredByAgent: agent.name,
            agentAvatar: agent.avatar,
            suggestedFix: "Sanitize all input via DOMPurify / Zod schema validation; enforce strict `maxlength` attributes.",
            impact: "Potential script execution or UI layout breakdown on edge inputs.",
          });
          newStatus = "bug_discovered";
          thought = "Critical boundary test hit! Input accepts oversized payloads without client validation.";
        }
      }
    } else if (agent.archetype === "mobile") {
      actionName = "TOUCH_GESTURE";
      details = "Simulated iPhone viewport (390x844). Tap target coordinates: (x: 210, y: 580)";
      if (Math.random() > 0.5) {
        newFrustration += 22;
        thought = "Sticky header or cookie banner is occluding the primary CTA on mobile! Tap target is under 32px.";
        sentiment = "frustrated";

        const bugId = `BUG-MOBILE-${agent.id}`;
        if (!existingBugs.some((b) => b.id.includes("MOBILE")) && !newBugs.some((b) => b.id.includes("MOBILE"))) {
          newBugs.push({
            id: bugId,
            title: "Mobile Viewport Touch-Target Occlusion",
            severity: "medium",
            category: "ux_friction",
            elementSelector: ".fixed-header, .sticky-nav, #primary-cta",
            description: "On screens <= 400px width, sticky navigational elements overlap the bottom action buttons, causing misclicks and rage taps.",
            reproductionSteps: [
              "1. Open Chrome DevTools in iPhone SE (375x667) emulation",
              "2. Scroll down 400px",
              "3. Try to tap the primary button: click is intercepted by sticky container",
            ],
            discoveredByAgent: agent.name,
            agentAvatar: agent.avatar,
            suggestedFix: "Add `pb-20` (padding-bottom) to main viewport container and increase min-height of interactive targets to 48px.",
            impact: "Mobile conversion drops by an estimated 28% due to tap interception.",
          });
        }
      } else {
        thought = "Mobile responsive layout rendering smoothly across hero grid.";
        sentiment = "positive";
      }
    } else if (agent.archetype === "rage_clicker") {
      actionName = "RAPID_RAGE_CLICK";
      details = "Fired 8 clicks within 1.2s on unresponsive DOM element.";
      newFrustration += 35;
      newStatus = "rage_clicking";
      thought = "I clicked it 5 times and nothing moved! No spinner, no disabled state, no feedback!";
      sentiment = "frustrated";

      const bugId = `BUG-RAGE-${agent.id}`;
      if (!existingBugs.some((b) => b.id.includes("RAGE")) && !newBugs.some((b) => b.id.includes("RAGE"))) {
        newBugs.push({
          id: bugId,
          title: "Missing Loading Indicator Triggers Rage-Clicks",
          severity: "high",
          category: "ux_friction",
          elementSelector: "button:contains('Submit'), .action-btn",
          description: "When an asynchronous API call is initiated, the button remains active without a spinner or disabled state, prompting impatient users to spam clicks.",
          reproductionSteps: [
            "1. Click the action button on a throttled connection",
            "2. Notice button shows zero visual feedback for > 600ms",
            "3. User clicks repeatedly in frustration",
          ],
          discoveredByAgent: agent.name,
          agentAvatar: agent.avatar,
          suggestedFix: "Implement immediate optimistic loading state (`isLoading ? <Spinner /> : 'Submit'`) and disable pointer events while pending.",
          impact: "Drives extreme user frustration and duplicate server requests.",
        });
      }
    } else if (agent.archetype === "accessibility") {
      actionName = "A11Y_AUDIT_TAB";
      details = "Testing aria-labels, WCAG AA contrast ratio, and keyboard trap avoidance.";
      thought = "Checking color contrast on secondary links and form input associations...";

      if (tickCount >= 2 && Math.random() > 0.5) {
        const bugId = `BUG-A11Y-${agent.id}`;
        if (!existingBugs.some((b) => b.id.includes("A11Y")) && !newBugs.some((b) => b.id.includes("A11Y"))) {
          newBugs.push({
            id: bugId,
            title: "Missing Accessible Name & Low Contrast Ratio",
            severity: "medium",
            category: "accessibility",
            elementSelector: "button.icon-only, input:not([aria-label])",
            description: "Icon-only buttons lack `aria-label` attributes, and muted gray text fails WCAG 2.1 AA 4.5:1 contrast requirements against dark background.",
            reproductionSteps: [
              "1. Run Lighthouse or axe-core DevTools audit",
              "2. Observe `button-name` rule failure on icon controls",
              "3. Inspect text color: contrast ratio measures 2.8:1 (below 4.5:1 standard)",
            ],
            discoveredByAgent: agent.name,
            agentAvatar: agent.avatar,
            suggestedFix: "Add `aria-label='...'` to icon buttons and elevate muted text color from `#64748b` to `#94a3b8`.",
            impact: "Non-compliant with ADA / EAA regulations; alienates assistive tech users.",
          });
        }
      }
    } else {
      // General exploring
      actionName = "INTERACT";
      thought = "Exploring user flow: evaluating pricing transparency and feature guarantees.";
      sentiment = "positive";
      details = `Inspected ${target}; layout is coherent and clear.`;
    }

    // Determine Bounce or Conversion
    let isBounced = false;
    let isConverted = false;

    if (newFrustration >= 75) {
      isBounced = true;
      newStatus = "bounced";
      thought = "Frustration exceeded tolerance threshold. Abandoning application flow.";
      sentiment = "frustrated";
    } else if (currentStep >= 90) {
      isConverted = true;
      newStatus = "converted";
      thought = "Goal successfully completed! Reached final confirmation state.";
      sentiment = "positive";
    }

    const actionItem: AgentAction = {
      timestamp: Date.now(),
      action: actionName,
      targetElement: target,
      details,
      sentiment,
    };

    return {
      ...state,
      status: newStatus,
      frustration: Math.min(100, Math.max(0, newFrustration)),
      satisfaction: Math.min(100, Math.max(0, newSatisfaction)),
      currentAction: `${actionName} on ${target}`,
      currentTarget: target,
      recentThought: thought,
      actionLog: [actionItem, ...state.actionLog.slice(0, 15)],
      completionPercentage: currentStep,
      bounced: isBounced,
      converted: isConverted,
    };
  });

  const allFinished = updatedStates.every((s) => s.bounced || s.converted || s.completionPercentage >= 100);

  return {
    updatedStates,
    newBugs,
    isFinished: allFinished || tickCount >= 8,
  };
}

export function generateIntelligenceReport(
  surface: AppSurfaceData,
  states: AgentSimulationState[],
  allBugs: DiscoveredBug[]
): IntelligenceReportData {
  const total = states.length;
  const converted = states.filter((s) => s.converted).length;
  const bounced = states.filter((s) => s.bounced).length;
  const avgFrustration = Math.round(states.reduce((acc, s) => acc + s.frustration, 0) / total);

  const conversionRate = Math.round((converted / Math.max(1, total)) * 100);
  const usabilityIndex = Math.max(15, Math.min(98, 100 - avgFrustration - allBugs.length * 6));

  const criticalCount = allBugs.filter((b) => b.severity === "critical").length;
  const securityGrade = criticalCount > 0 ? "D" : allBugs.length > 2 ? "B" : "A";

  return {
    appUrl: surface.url,
    overallScore: Math.round((usabilityIndex + conversionRate) / 2),
    usabilityIndex,
    securityGrade,
    accessibilityScore: 82 - (allBugs.some((b) => b.category === "accessibility") ? 24 : 0),
    conversionPrediction: conversionRate,
    swarmSummary: `A swarm of ${total} autonomous agents explored ${surface.url}. Overall conversion predicted at ${conversionRate}%, with an average user frustration index of ${avgFrustration}%. The swarm identified ${allBugs.length} unique bottlenecks and bugs spanning accessibility, async race conditions, and mobile tap targets.`,
    criticalDropoffNode: surface.surfaceNodes[2]?.label || "Onboarding Form / Checkout CTA",
    discoveredBugs: allBugs,
    recommendations: [
      {
        priority: "immediate",
        title: "Implement Debouncing and Instant Loading Spinners on CTAs",
        fixSnippet: "const [isSubmitting, setIsSubmitting] = useState(false);\n<button disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? <Spinner /> : 'Submit'}</button>",
        explanation: "Prevents race conditions and stops rage-clicks from impatient power users who spam unresponsive buttons.",
      },
      {
        priority: "high",
        title: "Fix Mobile Sticky-Header Z-Index & Padding Overlap",
        fixSnippet: "/* Add safe-area bottom padding */\n.main-viewport { padding-bottom: calc(4rem + env(safe-area-inset-bottom)); }",
        explanation: "Eliminates tap interception on iPhone and compact viewports where primary buttons were blocked by headers.",
      },
      {
        priority: "medium",
        title: "Add Explicit Form Labels & WCAG AA Contrast Colors",
        fixSnippet: "<label htmlFor='email' className='sr-only'>Email Address</label>\n<input id='email' aria-required='true' ... />",
        explanation: "Improves screen reader completion rates and helps low-vision/senior users clearly spot input boundaries.",
      },
    ],
  };
}
