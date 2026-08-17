import { cn } from "@/lib/utils";
import type { Health, Project } from "@/data/portfolio";
import { getHealthBreakdown } from "@/lib/portfolio-metrics";

const bar: Record<Health, string> = {
  Green: "bg-status-green",
  Amber: "bg-status-amber",
  Red: "bg-status-red",
};

const labels: Record<Health, string> = {
  Green: "On track",
  Amber: "At risk",
  Red: "Critical",
};

export function HealthOverview({ projects }: { projects: Project[] }) {
  const breakdown = getHealthBreakdown(projects);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Portfolio health</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Overall health distribution across {projects.length} active projects
        </p>
      </header>

      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {breakdown.map((b) =>
          b.count === 0 ? null : (
            <div
              key={b.health}
              className={cn(bar[b.health])}
              style={{ width: `${b.share}%` }}
              title={`${labels[b.health]}: ${b.count} (${b.share}%)`}
            />
          ),
        )}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        {breakdown.map((b) => (
          <div key={b.health} className="rounded-md border border-border bg-surface p-3">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={cn("size-2 rounded-full", bar[b.health])} aria-hidden />
              {labels[b.health]}
            </dt>
            <dd className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-xl font-semibold tabular-nums text-foreground">{b.count}</span>
              <span className="text-xs text-muted-foreground">{b.share}%</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
