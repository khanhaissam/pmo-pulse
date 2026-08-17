import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/portfolio-metrics";

export function ProjectTable({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase | "all">("all");
  const [health, setHealth] = useState<Health | "all">("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (q === "" || p.name.toLowerCase().includes(q) || p.manager.toLowerCase().includes(q)) &&
        (phase === "all" || p.phase === phase) &&
        (health === "all" || p.overallHealth === health),
    );
  }, [projects, query, phase, health]);

  return (
    <section className="rounded-lg border border-border bg-card">
      <header className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Project portfolio</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Showing {rows.length} of {projects.length} projects
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
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
            <SelectTrigger className="h-9 w-full text-sm sm:w-36" aria-label="Filter by health">
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All health</SelectItem>
              {healthValues.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[62rem] border-collapse text-sm">
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
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface">
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
                  <StatusDot health={p.scheduleHealth} srLabel={`Schedule ${p.scheduleHealth}`} />
                </td>
                <td className="px-4 py-3">
                  <StatusDot health={p.costHealth} srLabel={`Cost ${p.costHealth}`} />
                </td>
                <td className="px-4 py-3">
                  <StatusDot health={p.riskHealth} srLabel={`Risk ${p.riskHealth}`} />
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
