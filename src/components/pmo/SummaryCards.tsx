import { AlertTriangle, CircleAlert, CircleCheck, ClipboardList, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/lib/portfolio-metrics";

export function SummaryCards({ summary }: { summary: PortfolioSummary }) {
  const cards = [
    {
      label: "Active Projects",
      value: summary.activeProjects,
      icon: FolderKanban,
      accent: "text-muted-foreground",
    },
    { label: "On Track", value: summary.onTrack, icon: CircleCheck, accent: "text-status-green" },
    { label: "At Risk", value: summary.atRisk, icon: AlertTriangle, accent: "text-status-amber" },
    { label: "Critical", value: summary.critical, icon: CircleAlert, accent: "text-status-red" },
    {
      label: "Overdue Actions",
      value: summary.overdueActions,
      icon: ClipboardList,
      accent: summary.overdueActions > 0 ? "text-status-red" : "text-status-green",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
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
        </div>
      ))}
    </div>
  );
}
