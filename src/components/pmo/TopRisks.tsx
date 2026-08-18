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
  onSelectProject,
}: {
  risks: PortfolioRisk[];
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}) {
  const projectOf = (id: string) => projects.find((p) => p.id === id);
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
        {sorted.map((r) => {
          const project = projectOf(r.projectId);
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => project && onSelectProject?.(project)}
                aria-label={`View details for ${project?.name ?? r.projectId}`}
                className="-mx-2 block w-full rounded-md px-2 py-3 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {project?.name ?? r.projectId}
                  </span>
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
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
