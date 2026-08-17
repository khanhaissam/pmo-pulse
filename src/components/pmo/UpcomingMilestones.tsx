import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";
import { formatDate, getUpcomingMilestones } from "@/lib/portfolio-metrics";

const statusStyle: Record<string, string> = {
  Overdue: "bg-status-red-soft text-status-red",
  "Due soon": "bg-status-amber-soft text-status-amber",
  "On schedule": "bg-status-green-soft text-status-green",
};

export function UpcomingMilestones({ projects }: { projects: Project[] }) {
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
          {milestones.map((m) => (
            <li
              key={`${m.projectId}-${m.date}`}
              className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
