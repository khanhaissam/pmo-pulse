/**
 * PMO Pulse — fictional sample portfolio data (V1, local only).
 * All KPI cards, charts and lists derive from these arrays.
 */

export type Health = "Green" | "Amber" | "Red";

export type Phase =
  | "Planning"
  | "Engineering"
  | "Procurement"
  | "Construction"
  | "Commissioning";

export type Severity = "High" | "Medium" | "Low";

export interface Project {
  id: string;
  name: string;
  manager: string;
  phase: Phase;
  overallHealth: Health;
  scheduleHealth: Health;
  costHealth: Health;
  riskHealth: Health;
  progress: number;
  approvedBudget: number;
  forecastCost: number;
  openRisks: number;
  overdueActions: number;
  nextMilestone: string;
  nextMilestoneDate: string; // ISO date
}

export interface PortfolioRisk {
  id: string;
  projectId: string;
  description: string;
  severity: Severity;
  owner: string;
}

export const projects: Project[] = [
  {
    id: "atlas",
    name: "Project Atlas",
    manager: "Sarah Whitfield",
    phase: "Construction",
    overallHealth: "Amber",
    scheduleHealth: "Amber",
    costHealth: "Green",
    riskHealth: "Amber",
    progress: 62,
    approvedBudget: 18400000,
    forecastCost: 18950000,
    openRisks: 7,
    overdueActions: 3,
    nextMilestone: "Structural steel completion",
    nextMilestoneDate: "2026-08-28",
  },
  {
    id: "orion",
    name: "Project Orion",
    manager: "Daniel Mbeki",
    phase: "Engineering",
    overallHealth: "Green",
    scheduleHealth: "Green",
    costHealth: "Green",
    riskHealth: "Green",
    progress: 41,
    approvedBudget: 9600000,
    forecastCost: 9420000,
    openRisks: 3,
    overdueActions: 0,
    nextMilestone: "Detailed design freeze",
    nextMilestoneDate: "2026-09-04",
  },
  {
    id: "nova",
    name: "Project Nova",
    manager: "Elena Petrova",
    phase: "Procurement",
    overallHealth: "Red",
    scheduleHealth: "Red",
    costHealth: "Amber",
    riskHealth: "Red",
    progress: 28,
    approvedBudget: 24100000,
    forecastCost: 26800000,
    openRisks: 11,
    overdueActions: 6,
    nextMilestone: "Long-lead equipment award",
    nextMilestoneDate: "2026-08-21",
  },
  {
    id: "zenith",
    name: "Project Zenith",
    manager: "Marcus Rowe",
    phase: "Commissioning",
    overallHealth: "Amber",
    scheduleHealth: "Amber",
    costHealth: "Amber",
    riskHealth: "Green",
    progress: 88,
    approvedBudget: 13750000,
    forecastCost: 14320000,
    openRisks: 5,
    overdueActions: 2,
    nextMilestone: "System handover readiness review",
    nextMilestoneDate: "2026-09-09",
  },
  {
    id: "horizon",
    name: "Project Horizon",
    manager: "Priya Raman",
    phase: "Planning",
    overallHealth: "Green",
    scheduleHealth: "Green",
    costHealth: "Green",
    riskHealth: "Amber",
    progress: 12,
    approvedBudget: 5400000,
    forecastCost: 5350000,
    openRisks: 4,
    overdueActions: 0,
    nextMilestone: "Business case approval",
    nextMilestoneDate: "2026-09-11",
  },
  {
    id: "falcon",
    name: "Project Falcon",
    manager: "Tom Andersen",
    phase: "Construction",
    overallHealth: "Red",
    scheduleHealth: "Amber",
    costHealth: "Red",
    riskHealth: "Red",
    progress: 54,
    approvedBudget: 31200000,
    forecastCost: 35600000,
    openRisks: 9,
    overdueActions: 5,
    nextMilestone: "Mechanical installation 50%",
    nextMilestoneDate: "2026-08-25",
  },
  {
    id: "aurora",
    name: "Project Aurora",
    manager: "Nadia Hassan",
    phase: "Engineering",
    overallHealth: "Green",
    scheduleHealth: "Green",
    costHealth: "Amber",
    riskHealth: "Green",
    progress: 36,
    approvedBudget: 7800000,
    forecastCost: 8010000,
    openRisks: 2,
    overdueActions: 1,
    nextMilestone: "HAZOP close-out",
    nextMilestoneDate: "2026-09-15",
  },
  {
    id: "summit",
    name: "Project Summit",
    manager: "Grace Lindqvist",
    phase: "Procurement",
    overallHealth: "Green",
    scheduleHealth: "Green",
    costHealth: "Green",
    riskHealth: "Green",
    progress: 47,
    approvedBudget: 11250000,
    forecastCost: 11100000,
    openRisks: 3,
    overdueActions: 0,
    nextMilestone: "Contractor mobilisation",
    nextMilestoneDate: "2026-10-02",
  },
];

export const portfolioRisks: PortfolioRisk[] = [
  {
    id: "r1",
    projectId: "nova",
    description: "Long-lead equipment delivery delayed by 10 weeks from vendor",
    severity: "High",
    owner: "Elena Petrova",
  },
  {
    id: "r2",
    projectId: "falcon",
    description: "Cost forecast increase driven by civil rework and labour rates",
    severity: "High",
    owner: "Tom Andersen",
  },
  {
    id: "r3",
    projectId: "atlas",
    description: "Contractor resource shortage affecting steel erection sequence",
    severity: "Medium",
    owner: "Sarah Whitfield",
  },
  {
    id: "r4",
    projectId: "zenith",
    description: "Commissioning readiness at risk — spares and training incomplete",
    severity: "Medium",
    owner: "Marcus Rowe",
  },
  {
    id: "r5",
    projectId: "horizon",
    description: "Design approval delay from regulatory authority review cycle",
    severity: "Medium",
    owner: "Priya Raman",
  },
  {
    id: "r6",
    projectId: "aurora",
    description: "Scope growth in instrumentation package pending change control",
    severity: "Low",
    owner: "Nadia Hassan",
  },
];

export const phases: Phase[] = [
  "Planning",
  "Engineering",
  "Procurement",
  "Construction",
  "Commissioning",
];

export const healthValues: Health[] = ["Green", "Amber", "Red"];
