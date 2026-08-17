import { cn } from "@/lib/utils";
import type { Health, Project } from "@/data/portfolio";

const bar: Record<Health, string> = {
  Green: "bg-status-green",
  Amber: "bg-status-amber",
  Red: "bg-status-red",
};

export function ProgressOverview({ projects }: { projects: Project[] }) {
  const rows = [...projects].sort((a, b) => b.progress - a.progress);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Progress by project</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Reported completion percentage, coloured by overall health
        </p>
      </header>

      <ul className="mt-4 space-y-2.5">
        {rows.map((p) => (
          <li key={p.id} className="grid grid-cols-[minmax(0,7rem)_1fr_2.5rem] items-center gap-3">
            <span className="truncate text-xs font-medium text-foreground">{p.name}</span>
            <span className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <span
                className={cn("block h-full rounded-full", bar[p.overallHealth])}
                style={{ width: `${p.progress}%` }}
              />
            </span>
            <span className="text-right text-xs tabular-nums text-muted-foreground">
              {p.progress}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
