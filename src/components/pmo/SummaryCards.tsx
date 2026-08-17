import { AlertTriangle, CircleAlert, CircleCheck, ClipboardList, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/lib/portfolio-metrics";

export type SummaryFilter = "all" | "green" | "amber" | "red" | "overdue";

export function SummaryCards({
  summary,
  activeFilter = "all",
  onFilterChange,
}: {
  summary: PortfolioSummary;
  activeFilter?: SummaryFilter;
  onFilterChange?: (filter: SummaryFilter) => void;
}) {
  const cards: Array<{
    label: string;
    value: number;
    icon: typeof FolderKanban;
    accent: string;
    filter: SummaryFilter;
  }> = [
    {
      label: "Active Projects",
      value: summary.activeProjects,
      icon: FolderKanban,
      accent: "text-muted-foreground",
      filter: "all",
    },
    {
      label: "On Track",
      value: summary.onTrack,
      icon: CircleCheck,
      accent: "text-status-green",
      filter: "green",
    },
    {
      label: "At Risk",
      value: summary.atRisk,
      icon: AlertTriangle,
      accent: "text-status-amber",
      filter: "amber",
    },
    {
      label: "Critical",
      value: summary.critical,
      icon: CircleAlert,
      accent: "text-status-red",
      filter: "red",
    },
    {
      label: "Overdue Actions",
      value: summary.overdueActions,
      icon: ClipboardList,
      accent: summary.overdueActions > 0 ? "text-status-red" : "text-status-green",
      filter: "overdue",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => {
        const active = activeFilter === c.filter;
        return (
          <button
            key={c.label}
            type="button"
            aria-pressed={active}
            onClick={() =>
              onFilterChange?.(active && c.filter !== "all" ? "all" : c.filter)
            }
            className={cn(
              "rounded-lg border bg-card p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active ? "border-foreground/40 bg-surface" : "border-border",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {c.label}
              </p>
              <c.icon className={cn("size-4 shrink-0", c.accent)} aria-hidden />
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums leading-none text-foreground">
              {c.value}
            </p>
            {active && (
              <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                {c.filter === "all" ? "Showing all projects" : "Filtering portfolio"}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
