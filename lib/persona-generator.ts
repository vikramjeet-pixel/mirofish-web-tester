import { AgentPersona, AgentArchetype, SimulationConfig } from "@/types";

const PERSONA_TEMPLATES: {
  archetype: AgentArchetype;
  name: string;
  avatar: string;
  role: string;
  age: number;
  techLiteracy: "Low" | "Medium" | "High" | "Expert";
  patience: number;
  device: "Desktop Chrome" | "iPhone Safari" | "Android Chrome" | "Screen Reader" | "High Latency 3G";
  bias: string;
  adversarialTraits?: string[];
}[] = [
  {
    archetype: "novice",
    name: "Nancy Miller",
    avatar: "👵",
    role: "First-Time Senior User",
    age: 69,
    techLiteracy: "Low",
    patience: 35,
    device: "Desktop Chrome",
    bias: "Easily intimidated by technical jargon; relies on explicit labels and high-contrast buttons.",
  },
  {
    archetype: "speedrunner",
    name: "Sam Takahashi",
    avatar: "⚡",
    role: "Power Keyboard User",
    age: 26,
    techLiteracy: "Expert",
    patience: 85,
    device: "Desktop Chrome",
    bias: "Navigates exclusively using Tab, Enter, and shortcuts. Double-clicks everything rapidly.",
    adversarialTraits: ["rapid_double_clicks", "submits_before_typing_completes"],
  },
  {
    archetype: "adversarial",
    name: "Casey Stone (Chaos)",
    avatar: "🥊",
    role: "Adversarial Boundary Tester",
    age: 31,
    techLiteracy: "Expert",
    patience: 95,
    device: "Desktop Chrome",
    bias: "Deliberately inputs edge-case strings: emoji floods, negative numbers, SQL fragments, and 5,000-char text.",
    adversarialTraits: ["xss_payloads", "sql_injection_probes", "negative_quantity", "zero_length_strings"],
  },
  {
    archetype: "mobile",
    name: "Marco Silva",
    avatar: "📱",
    role: "Commuter on Flaky 3G",
    age: 24,
    techLiteracy: "Medium",
    patience: 25,
    device: "High Latency 3G",
    bias: "Small viewport (390px), thumb-driven gestures. Drops off instantly if buttons are smaller than 44px.",
  },
  {
    archetype: "shopper",
    name: "Sophia Jenkins",
    avatar: "🛒",
    role: "Value-Conscious Buyer",
    age: 38,
    techLiteracy: "Medium",
    patience: 50,
    device: "iPhone Safari",
    bias: "Scrutinizes checkout forms, looks for security badges, gets suspicious at vague pricing models.",
  },
  {
    archetype: "accessibility",
    name: "Aaron Chen",
    avatar: "♿",
    role: "Assistive Tech User",
    age: 42,
    techLiteracy: "High",
    patience: 60,
    device: "Screen Reader",
    bias: "Relies on aria-labels, semantic HTML, and visible focus rings. Flags trapped keyboard focus.",
  },
  {
    archetype: "enterprise",
    name: "Elena Rostova",
    avatar: "💼",
    role: "SaaS Procurement Lead",
    age: 47,
    techLiteracy: "High",
    patience: 40,
    device: "Desktop Chrome",
    bias: "Checks footer links for Terms, Privacy, SOC2 compliance, team roles, and contact support.",
  },
  {
    archetype: "rage_clicker",
    name: "Ray 'Spam' O'Connor",
    avatar: "😤",
    role: "Impatient Action Spammer",
    age: 22,
    techLiteracy: "Medium",
    patience: 15,
    device: "Android Chrome",
    bias: "Spams clicks 10 times in 2 seconds if a spinner does not appear within 300 milliseconds.",
    adversarialTraits: ["rapid_fire_clicking", "multi_click_submit"],
  },
];

export function generateSwarm(config: SimulationConfig): AgentPersona[] {
  const swarm: AgentPersona[] = [];
  const targetCount = config.swarmSize;

  for (let i = 0; i < targetCount; i++) {
    const template = PERSONA_TEMPLATES[i % PERSONA_TEMPLATES.length];
    const variationSuffix = i >= PERSONA_TEMPLATES.length ? ` #${Math.floor(i / PERSONA_TEMPLATES.length) + 1}` : "";

    // Adjust attributes based on adversarial intensity
    let patienceModifier = 0;
    if (config.adversarialIntensity === "high" || config.adversarialIntensity === "chaos") {
      patienceModifier = template.archetype === "adversarial" || template.archetype === "rage_clicker" ? 15 : -10;
    }

    swarm.push({
      ...template,
      id: `agent_${i + 1}_${template.archetype}`,
      name: `${template.name}${variationSuffix}`,
      patience: Math.max(10, Math.min(100, template.patience + patienceModifier)),
    });
  }

  return swarm;
}
