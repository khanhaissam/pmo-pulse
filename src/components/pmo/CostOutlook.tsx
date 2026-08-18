import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";
import { formatCurrency, formatVariance, getCostOutlook } from "@/lib/portfolio-metrics";

export function CostOutlook({ projects }: { projects: Project[] }) {
  const outlook = getCostOutlook(projects);
  const varianceTone = outlook.favourable ? "text-status-green" : "text-status-red";
  const varianceWording = outlook.favourable
    ? `${Math.abs(outlook.variancePercent).toFixed(1)}% below budget`
    : `+${outlook.variancePercent.toFixed(1)}% above budget`;

  const metrics: Array<{ label: string; value: string; detail?: string; tone?: string }> = [
    { label: "Approved Budget", value: formatCurrency(outlook.approvedBudget) },
    { label: "Forecast Cost", value: formatCurrency(outlook.forecastCost) },
    {
      label: "Forecast Variance",
      value: formatVariance(outlook.varianceAmount),
      detail: varianceWording,
      tone: varianceTone,
    },
    {
      label: "Projects Above Budget",
      value: `${outlook.projectsAboveBudget}`,
      detail: `of ${projects.length} projects`,
    },
  ];

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Portfolio Cost Outlook</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Approved budget versus current forecast across the portfolio
        </p>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md border border-border bg-surface p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {m.label}
            </dt>
            <dd
              className={cn(
                "mt-1.5 text-xl font-semibold tabular-nums leading-none",
                m.tone ?? "text-foreground",
              )}
            >
              {m.value}
            </dd>
            {m.detail && (
              <p className={cn("mt-1 text-[11px] font-medium", m.tone ?? "text-muted-foreground")}>
                {m.detail}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
