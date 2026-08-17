import type { Health, Project } from "@/data/portfolio";

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

export function daysUntil(iso: string, from = new Date()): number {
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
  from = new Date(),
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
    .filter((m) => m.daysAway <= windowDays)
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

/** Generates management-attention reasons from project fields (no manual text per project). */
export function getAttentionReasons(project: Project, limit = 4): AttentionReason[] {
  const reasons: AttentionReason[] = [];
  const variance = getCostVariance(project);

  const dimensions: Array<[string, Health]> = [
    ["Schedule", project.scheduleHealth],
    ["Cost", project.costHealth],
    ["Risk", project.riskHealth],
  ];

  for (const [name, health] of dimensions) {
    if (health === "Red") reasons.push({ label: `${name} Red`, tone: "critical" });
  }
  if (!variance.favourable && variance.percent >= 10) {
    reasons.push({
      label: `High forecast variance ${formatVariancePercent(variance.percent)}`,
      tone: "critical",
    });
  }
  for (const [name, health] of dimensions) {
    if (health === "Amber") reasons.push({ label: `${name} Amber`, tone: "warning" });
  }
  if (!variance.favourable && variance.percent < 10 && variance.amount > 0) {
    reasons.push({
      label: `Forecast above approved budget (${formatVariance(variance.amount)})`,
      tone: "warning",
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
  const rank: Record<string, number> = { Red: 0, Amber: 1 };
  return list
    .filter((p) => p.overallHealth === "Red" || p.overallHealth === "Amber")
    .slice()
    .sort(
      (a, b) =>
        rank[a.overallHealth] - rank[b.overallHealth] ||
        b.overdueActions - a.overdueActions ||
        b.openRisks - a.openRisks,
    );
}

export function getMilestoneStatus(
  iso: string,
  from = new Date(),
): UpcomingMilestone["status"] {
  const daysAway = daysUntil(iso, from);
  return daysAway < 0 ? "Overdue" : daysAway <= 10 ? "Due soon" : "On schedule";
}
