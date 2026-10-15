export type AgentArchetype =
  | "novice"
  | "speedrunner"
  | "adversarial"
  | "mobile"
  | "shopper"
  | "accessibility"
  | "enterprise"
  | "rage_clicker";

export interface AgentPersona {
  id: string;
  name: string;
  archetype: AgentArchetype;
  avatar: string;
  age: number;
  techLiteracy: "Low" | "Medium" | "High" | "Expert";
  patience: number; // 0 - 100
  device: "Desktop Chrome" | "iPhone Safari" | "Android Chrome" | "Screen Reader" | "High Latency 3G";
  role: string;
  bias: string;
  adversarialTraits?: string[];
}

export type AgentStatus =
  | "initializing"
  | "exploring"
  | "filling_form"
  | "testing_boundary"
  | "confused"
  | "rage_clicking"
  | "bounced"
  | "converted"
  | "bug_discovered";

export interface AgentAction {
  timestamp: number;
  action: string;
  targetElement: string;
  details: string;
  sentiment: "positive" | "neutral" | "negative" | "frustrated";
}

export interface AgentSimulationState {
  agent: AgentPersona;
  status: AgentStatus;
  frustration: number; // 0 - 100
  satisfaction: number; // 0 - 100
  currentAction: string;
  currentTarget: string;
  recentThought: string;
  actionLog: AgentAction[];
  bugsFound: string[];
  converted: boolean;
  bounced: boolean;
  completionPercentage: number;
}

export interface DiscoveredBug {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "functional" | "ux_friction" | "security" | "accessibility" | "performance";
  elementSelector: string;
  description: string;
  reproductionSteps: string[];
  discoveredByAgent: string;
  agentAvatar: string;
  suggestedFix: string;
  impact: string;
}

export interface DiscoveredSurfaceNode {
  id: string;
  type: "page" | "button" | "form" | "input" | "link" | "modal";
  label: string;
  selector: string;
  url: string;
  health: "healthy" | "warning" | "failing";
  interactionCount: number;
  dropOffRate: number;
}

export interface AppSurfaceData {
  url: string;
  title: string;
  metaDescription: string;
  statusCode: number;
  latencyMs: number;
  isLive: boolean;
  headings: string[];
  interactiveElements: {
    buttons: string[];
    inputs: string[];
    forms: string[];
    links: string[];
  };
  securityHeaders: {
    hasHsts: boolean;
    hasCsp: boolean;
    hasXFrameOptions: boolean;
  };
  detectedFramework: string;
  surfaceNodes: DiscoveredSurfaceNode[];
}

export interface SimulationConfig {
  targetUrl: string;
  swarmSize: number; // 10, 25, 50, 100
  adversarialIntensity: "low" | "medium" | "high" | "chaos";
  testDepth: "shallow" | "deep" | "exhaustive";
  focusAreas: ("forms" | "navigation" | "accessibility" | "security" | "performance")[];
}

export interface IntelligenceReportData {
  appUrl: string;
  overallScore: number; // 0 - 100
  usabilityIndex: number;
  securityGrade: "A" | "B" | "C" | "D" | "F";
  accessibilityScore: number;
  conversionPrediction: number; // percentage
  swarmSummary: string;
  criticalDropoffNode: string;
  discoveredBugs: DiscoveredBug[];
  recommendations: {
    priority: "immediate" | "high" | "medium";
    title: string;
    fixSnippet: string;
    explanation: string;
  }[];
}
