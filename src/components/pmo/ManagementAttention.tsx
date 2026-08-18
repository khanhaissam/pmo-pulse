import { cn } from "@/lib/utils";
import type { Project } from "@/data/portfolio";
import { StatusPill } from "./StatusPill";
import {
  getAttentionProjects,
  getAttentionReasons,
  type ReasonTone,
} from "@/lib/portfolio-metrics";

const reasonStyle: Record<ReasonTone, string> = {
  critical: "bg-status-red-soft text-status-red",
  warning: "bg-status-amber-soft text-status-amber",
  neutral: "bg-muted text-muted-foreground",
};

export function ManagementAttention({
  projects,
  onSelectProject,
}: {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}) {
  const attention = getAttentionProjects(projects);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-sm font-semibold text-foreground">Management Attention</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Projects requiring management review based on current portfolio indicators
        </p>
      </header>

      {attention.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No projects currently require management attention.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {attention.map((p) => {
            const critical = p.overallHealth === "Red";
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelectProject?.(p)}
                  className={cn(
                    "flex h-full w-full flex-col gap-3 rounded-lg border bg-surface p-4 text-left transition-colors hover:bg-muted/50",
                    critical
                      ? "border-status-red/40 border-l-2 border-l-status-red"
                      : "border-border border-l-2 border-l-status-amber",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.phase} · {p.manager}
                      </p>
                    </div>
                    <StatusPill health={p.overallHealth} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-foreground/70"
                        style={{ width: `${p.progress}%` }}
                      />
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {p.progress}%
                    </span>
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {getAttentionReasons(p).map((r) => (
                      <li
                        key={r.label}
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[11px] font-medium",
                          reasonStyle[r.tone],
                        )}
                      >
                        {r.label}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
