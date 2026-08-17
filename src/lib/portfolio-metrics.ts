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
