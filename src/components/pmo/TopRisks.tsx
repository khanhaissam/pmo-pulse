import { cn } from "@/lib/utils";
import type { PortfolioRisk, Project, Severity } from "@/data/portfolio";

const severityStyle: Record<Severity, string> = {
  High: "bg-status-red-soft text-status-red",
  Medium: "bg-status-amber-soft text-status-amber",
  Low: "bg-muted text-muted-foreground",
};

const severityRank: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };

export function TopRisks({
  risks,
  projects,
}: {
  risks: PortfolioRisk[];
  projects: Project[];
}) {
  const nameOf = (id: string) => projects.find((p) => p.id === id)?.name ?? id;
  const sorted = [...risks].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Top portfolio risks</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Highest exposure items requiring management decisions
        </p>
      </header>

      <ul className="mt-4 divide-y divide-border">
        {sorted.map((r) => (
          <li key={r.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{nameOf(r.projectId)}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[11px] font-medium",
                  severityStyle[r.severity],
                )}
              >
                {r.severity}
              </span>
            </div>
            <p className="mt-1 text-sm leading-snug text-foreground">{r.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">Owner: {r.owner}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
