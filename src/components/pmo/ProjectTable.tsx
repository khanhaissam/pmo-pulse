import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusDot, StatusPill } from "./StatusPill";
import { type Health, type Phase, type Project, healthValues, phases } from "@/data/portfolio";
import {
  formatCurrency,
  formatDate,
  getCostLabel,
  sortOptions,
  sortProjects,
  type SortKey,
} from "@/lib/portfolio-metrics";
import { overallLabel, riskLabel, scheduleLabel } from "@/lib/status-labels";

export function ProjectTable({
  projects,
  totalCount,
  onSelectProject,
}: {
  projects: Project[];
  /** Full portfolio size, so the header always counts against the whole portfolio. */
  totalCount: number;
  onSelectProject?: (project: Project) => void;
}) {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase | "all">("all");
  const [health, setHealth] = useState<Health | "all">("all");
  const [sort, setSort] = useState<SortKey>("priority");

  const tableFiltersActive = query.trim() !== "" || phase !== "all" || health !== "all";

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = projects.filter(
      (p) =>
        (q === "" || p.name.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q)) &&
        (phase === "all" || p.phase === phase) &&
        (health === "all" || p.overallHealth === health),
    );
    return sortProjects(filtered, sort);
  }, [projects, query, phase, health, sort]);

  const clearFilters = () => {
    setQuery("");
    setPhase("all");
    setHealth("all");
  };

  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Project portfolio</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Showing {rows.length} of {totalCount} projects
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Select a project to view detailed health, cost, risks and milestone information.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative sm:w-56">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search project or manager"
              aria-label="Search projects"
              className="h-9 pl-8 text-sm"
            />
          </div>

          <Select value={phase} onValueChange={(v) => setPhase(v as Phase | "all")}>
            <SelectTrigger className="h-9 w-full text-sm sm:w-40" aria-label="Filter by phase">
              <SelectValue placeholder="Phase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All phases</SelectItem>
              {phases.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={health} onValueChange={(v) => setHealth(v as Health | "all")}>
            <SelectTrigger className="h-9 w-full text-sm sm:w-40" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {healthValues.map((h) => (
                <SelectItem key={h} value={h}>
                  {overallLabel[h]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-9 w-full text-sm sm:w-48" aria-label="Sort projects by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  Sort: {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {tableFiltersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" aria-hidden />
              Clear filters
            </button>
          )}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[68rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              {[
                "Project",
                "Phase",
                "Overall",
                "Schedule",
                "Cost",
                "Risk",
                "Progress",
                "Next Milestone",
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${p.name}`}
                onClick={() => onSelectProject?.(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject?.(p);
                  }
                }}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.manager} · {formatCurrency(p.approvedBudget)} approved ·{" "}
                    {formatCurrency(p.forecastCost)} forecast
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.phase}</td>
                <td className="px-4 py-3">
                  <StatusPill health={p.overallHealth} />
                </td>
                <td className="px-4 py-3">
                  <StatusDot
                    health={p.scheduleHealth}
                    label={scheduleLabel[p.scheduleHealth]}
                    srLabel={`Schedule: ${scheduleLabel[p.scheduleHealth]}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusDot
                    health={p.costHealth}
                    label={getCostLabel(p)}
                    srLabel={`Cost: ${getCostLabel(p)}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <StatusDot
                    health={p.riskHealth}
                    label={riskLabel[p.riskHealth]}
                    srLabel={`Risk: ${riskLabel[p.riskHealth]}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-foreground/70"
                        style={{ width: `${p.progress}%` }}
                      />
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {p.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{p.nextMilestone}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">
                    {formatDate(p.nextMilestoneDate)} · {p.openRisks} open risks ·{" "}
                    {p.overdueActions} overdue
                  </p>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No projects match the current search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
