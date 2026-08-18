import { portfolioMeta, type Health, type Project } from "@/data/portfolio";
import {
  costLabelFromPercent,
  healthRank,
  riskLabel,
  scheduleLabel,
} from "@/lib/status-labels";

/** Fixed reporting date for all derived timing (never the system clock). */
export const reportingDate = new Date(`${portfolioMeta.reportingDate}T00:00:00Z`);

export interface PortfolioSummary {
  activeProjects: number;
  onTrack: number;
  atRisk: number;
  critical: number;
  overdueActions: number;
}

export function getPortfolioSummary(list: Project[]): PortfolioSummary {
  return {
    activeProjects: list.length,
    onTrack: list.filter((p) => p.overallHealth === "Green").length,
    atRisk: list.filter((p) => p.overallHealth === "Amber").length,
    critical: list.filter((p) => p.overallHealth === "Red").length,
    overdueActions: list.reduce((sum, p) => sum + p.overdueActions, 0),
  };
}

export function getHealthBreakdown(list: Project[]): Array<{
  health: Health;
  count: number;
  share: number;
}> {
  const order: Health[] = ["Green", "Amber", "Red"];
  return order.map((health) => {
    const count = list.filter((p) => p.overallHealth === health).length;
    return {
      health,
      count,
      share: list.length ? Math.round((count / list.length) * 100) : 0,
    };
  });
}

export function daysUntil(iso: string, from = reportingDate): number {
  const target = new Date(`${iso}T00:00:00Z`);
  const base = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  return Math.round((target.getTime() - base) / 86_400_000);
}

export interface UpcomingMilestone {
  projectId: string;
  projectName: string;
  milestone: string;
  date: string;
  daysAway: number;
  status: "Overdue" | "Due soon" | "On schedule";
}

export function getUpcomingMilestones(
  list: Project[],
  windowDays = 30,
  from = reportingDate,
): UpcomingMilestone[] {
  return list
    .map((p) => {
      const daysAway = daysUntil(p.nextMilestoneDate, from);
      const status: UpcomingMilestone["status"] =
        daysAway < 0 ? "Overdue" : daysAway <= 10 ? "Due soon" : "On schedule";
      return {
        projectId: p.id,
        projectName: p.name,
        milestone: p.nextMilestone,
        date: p.nextMilestoneDate,
        daysAway,
        status,
      };
    })
    .filter((m) => m.daysAway <= windowDays && m.daysAway >= -windowDays)
    .sort((a, b) => a.daysAway - b.daysAway);
}

export function formatCurrency(value: number): string {
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* ---------- V2 derived metrics ---------- */

export interface CostVariance {
  amount: number; // forecastCost - approvedBudget
  percent: number;
  favourable: boolean;
}

export function getCostVariance(project: Project): CostVariance {
  const amount = project.forecastCost - project.approvedBudget;
  const percent = project.approvedBudget ? (amount / project.approvedBudget) * 100 : 0;
  return { amount, percent, favourable: amount <= 0 };
}

export function formatVariance(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}

export function formatVariancePercent(percent: number): string {
  const sign = percent > 0 ? "+" : percent < 0 ? "-" : "";
  return `${sign}${Math.abs(percent).toFixed(1)}%`;
}

export type ReasonTone = "critical" | "warning" | "neutral";

export interface AttentionReason {
  label: string;
  tone: ReasonTone;
}

/** Semantic cost wording for a project, from the single cost-variance calculation. */
export function getCostLabel(project: Project): string {
  return costLabelFromPercent(getCostVariance(project).percent);
}

/**
 * Management-attention reasons in plain management language.
 * Only exceptions are reported: healthy dimensions and favourable forecasts are omitted.
 */
export function getAttentionReasons(project: Project, limit = 4): AttentionReason[] {
  const reasons: AttentionReason[] = [];
  const variance = getCostVariance(project);

  if (project.scheduleHealth !== "Green") {
    reasons.push({
      label: scheduleLabel[project.scheduleHealth],
      tone: project.scheduleHealth === "Red" ? "critical" : "warning",
    });
  }
  if (project.riskHealth !== "Green") {
    reasons.push({
      label: riskLabel[project.riskHealth],
      tone: project.riskHealth === "Red" ? "critical" : "warning",
    });
  }
  // Single cost reason, derived from forecast vs approved budget only.
  if (variance.percent >= 0.5) {
    reasons.push({
      label: costLabelFromPercent(variance.percent),
      tone: variance.percent >= 10 ? "critical" : "warning",
    });
  }
  if (project.overdueActions > 0) {
    reasons.push({
      label: `${project.overdueActions} overdue action${project.overdueActions === 1 ? "" : "s"}`,
      tone: project.overdueActions >= 3 ? "critical" : "warning",
    });
  }
  if (project.openRisks > 0) {
    reasons.push({
      label: `${project.openRisks} open risk${project.openRisks === 1 ? "" : "s"}`,
      tone: "neutral",
    });
  }

  return reasons.slice(0, limit);
}

/** Red first, then Amber; within a band, most overdue actions and risks first. */
export function getAttentionProjects(list: Project[]): Project[] {
  return list
    .filter((p) => p.overallHealth === "Red" || p.overallHealth === "Amber")
    .slice()
    .sort(
      (a, b) =>
        healthRank(a.overallHealth) - healthRank(b.overallHealth) ||
        b.overdueActions - a.overdueActions ||
        b.openRisks - a.openRisks,
    );
}

export function getMilestoneStatus(
  iso: string,
  from = reportingDate,
): UpcomingMilestone["status"] {
  const daysAway = daysUntil(iso, from);
  return daysAway < 0 ? "Overdue" : daysAway <= 10 ? "Due soon" : "On schedule";
}

/* ---------- V3 portfolio cost outlook ---------- */

export interface CostOutlook {
  approvedBudget: number;
  forecastCost: number;
  varianceAmount: number;
  variancePercent: number;
  favourable: boolean;
  projectsAboveBudget: number;
}

export function getCostOutlook(list: Project[]): CostOutlook {
  const approvedBudget = list.reduce((sum, p) => sum + p.approvedBudget, 0);
  const forecastCost = list.reduce((sum, p) => sum + p.forecastCost, 0);
  const varianceAmount = forecastCost - approvedBudget;
  return {
    approvedBudget,
    forecastCost,
    varianceAmount,
    variancePercent: approvedBudget ? (varianceAmount / approvedBudget) * 100 : 0,
    favourable: varianceAmount <= 0,
    projectsAboveBudget: list.filter((p) => p.forecastCost > p.approvedBudget).length,
  };
}

/* ---------- V3 analytical sorting ---------- */

export type SortKey = "priority" | "name" | "progress" | "milestone" | "variance";

export const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "priority", label: "Management Priority" },
  { value: "name", label: "Project Name" },
  { value: "progress", label: "Progress" },
  { value: "milestone", label: "Next Milestone" },
  { value: "variance", label: "Cost Variance" },
];

/** Returns a new sorted array; never mutates the input. */
export function sortProjects(list: Project[], key: SortKey): Project[] {
  const copy = [...list];
  switch (key) {
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "progress":
      return copy.sort((a, b) => b.progress - a.progress);
    case "milestone":
      return copy.sort((a, b) => a.nextMilestoneDate.localeCompare(b.nextMilestoneDate));
    case "variance":
      return copy.sort(
        (a, b) => getCostVariance(b).percent - getCostVariance(a).percent,
      );
    default:
      return copy.sort(
        (a, b) =>
          healthRank(a.overallHealth) - healthRank(b.overallHealth) ||
          b.overdueActions - a.overdueActions ||
          b.openRisks - a.openRisks,
      );
  }
}
