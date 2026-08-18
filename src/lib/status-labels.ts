/**
 * Central semantic presentation layer.
 * Converts internal RAG health values (Green / Amber / Red) into meaningful
 * user-facing wording. Colours stay Green/Amber/Red; text explains meaning.
 */
import type { Health, Project } from "@/data/portfolio";
import { formatVariancePercent, getCostVariance } from "@/lib/portfolio-metrics";

export const overallLabel: Record<Health, string> = {
  Green: "On Track",
  Amber: "At Risk",
  Red: "Critical",
};

export const scheduleLabel: Record<Health, string> = {
  Green: "On Schedule",
  Amber: "Schedule at Risk",
  Red: "Behind Schedule",
};

export const riskLabel: Record<Health, string> = {
  Green: "Low Risk Exposure",
  Amber: "Moderate Risk Exposure",
  Red: "High Risk Exposure",
};

/** Cost wording is derived from forecast vs approved budget, never from costHealth. */
export function costLabel(project: Project): string {
  const { percent } = getCostVariance(project);
  if (Math.abs(percent) < 0.5) return "Forecast on budget";
  if (percent < 0) return `Forecast ${Math.abs(percent).toFixed(1)}% below budget`;
  return `Forecast ${formatVariancePercent(percent)} above budget`;
}

/** Rank used for management-priority ordering: Critical, then At Risk, then On Track. */
export function healthRank(health: Health): number {
  return health === "Red" ? 0 : health === "Amber" ? 1 : 2;
}
