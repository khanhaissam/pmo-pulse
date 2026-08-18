import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";
import { formatDate, getUpcomingMilestones } from "@/lib/portfolio-metrics";

const statusStyle: Record<string, string> = {
  Overdue: "bg-status-red-soft text-status-red",
  "Due soon": "bg-status-amber-soft text-status-amber",
  "On schedule": "bg-status-green-soft text-status-green",
};

export function UpcomingMilestones({
  projects,
  onSelectProject,
}: {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}) {
  const milestones = getUpcomingMilestones(projects, 30);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Upcoming milestones</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Next 30 days</p>
      </header>

      {milestones.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No milestones fall within the next 30 days.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {milestones.map((m) => {
            const project = projects.find((p) => p.id === m.projectId);
            return (
              <li key={`${m.projectId}-${m.date}`}>
                <button
                  type="button"
                  onClick={() => project && onSelectProject?.(project)}
                  aria-label={`View details for ${m.projectName}`}
                  className="-mx-2 flex w-full flex-wrap items-center justify-between gap-2 rounded-md px-2 py-3 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{m.projectName}</p>
                    <p className="truncate text-sm text-foreground">{m.milestone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatDate(m.date)}
                    </span>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[11px] font-medium",
                        statusStyle[m.status],
                      )}
                    >
                      {m.status}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
