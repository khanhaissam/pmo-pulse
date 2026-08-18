import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { PortfolioRisk, Project, Severity } from "@/data/portfolio";
import { StatusDot, StatusPill } from "./StatusPill";
import {
  formatCurrency,
  formatDate,
  formatVariance,
  formatVariancePercent,
  getCostVariance,
  getMilestoneStatus,
} from "@/lib/portfolio-metrics";

const severityStyle: Record<Severity, string> = {
  High: "bg-status-red-soft text-status-red",
  Medium: "bg-status-amber-soft text-status-amber",
  Low: "bg-muted text-muted-foreground",
};

const milestoneStyle: Record<string, string> = {
  Overdue: "bg-status-red-soft text-status-red",
  "Due soon": "bg-status-amber-soft text-status-amber",
  "On schedule": "bg-status-green-soft text-status-green",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function ProjectDetail({
  project,
  risks,
  onOpenChange,
}: {
  project: Project | null;
  risks: PortfolioRisk[];
  onOpenChange: (open: boolean) => void;
}) {
  const variance = project ? getCostVariance(project) : null;
  const projectRisks = project ? risks.filter((r) => r.projectId === project.id) : [];
  const milestoneStatus = project ? getMilestoneStatus(project.nextMilestoneDate) : null;

  return (
    <Sheet open={project !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {project && variance && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-base">{project.name}</SheetTitle>
              <SheetDescription>
                {project.phase} · {project.manager}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-5 space-y-4">
              <Block title="Overview">
                <Row label="Project manager" value={project.manager} />
                <Row label="Phase" value={project.phase} />
                <Row label="Progress" value={`${project.progress}%`} />
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-foreground/70"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </Block>

              <Block title="Health">
                <div className="flex items-center justify-between gap-3 py-1.5">
                  <span className="text-xs text-muted-foreground">Overall</span>
                  <StatusPill health={project.overallHealth} />
                </div>
                <Row
                  label="Schedule"
                  value={
                    <StatusDot
                      health={project.scheduleHealth}
                      label={scheduleLabel[project.scheduleHealth]}
                      srLabel={`Schedule: ${scheduleLabel[project.scheduleHealth]}`}
                    />
                  }
                />
                <Row
                  label="Cost"
                  value={
                    <StatusDot
                      health={project.costHealth}
                      label={getCostLabel(project)}
                      srLabel={`Cost: ${getCostLabel(project)}`}
                    />
                  }
                />
                <Row
                  label="Risk"
                  value={
                    <StatusDot
                      health={project.riskHealth}
                      label={riskLabel[project.riskHealth]}
                      srLabel={`Risk: ${riskLabel[project.riskHealth]}`}
                    />
                  }
                />
              </Block>

              <Block title="Cost">
                <Row label="Approved budget" value={formatCurrency(project.approvedBudget)} />
                <Row label="Forecast cost" value={formatCurrency(project.forecastCost)} />
                <Row
                  label="Cost variance"
                  value={
                    <span
                      className={cn(
                        variance.favourable ? "text-status-green" : "text-status-red",
                      )}
                    >
                      {formatVariance(variance.amount)}{" "}
                      <span className="text-xs">
                        ({variance.favourable ? "favourable" : "increase"})
                      </span>
                    </span>
                  }
                />
                <Row
                  label="Cost variance %"
                  value={
                    <span
                      className={cn(
                        variance.favourable ? "text-status-green" : "text-status-red",
                      )}
                    >
                      {formatVariancePercent(variance.percent)}
                    </span>
                  }
                />
              </Block>

              <Block title="Project controls">
                <Row label="Open risks" value={project.openRisks} />
                <Row label="Overdue actions" value={project.overdueActions} />
              </Block>

              <Block title="Next milestone">
                <p className="text-sm text-foreground">{project.nextMilestone}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {formatDate(project.nextMilestoneDate)}
                  </span>
                  {milestoneStatus && (
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[11px] font-medium",
                        milestoneStyle[milestoneStatus],
                      )}
                    >
                      {milestoneStatus}
                    </span>
                  )}
                </div>
              </Block>

              <Block title="Relevant risks">
                {projectRisks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No portfolio risks are logged for this project.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {projectRisks.map((r) => (
                      <li key={r.id} className="py-2 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-foreground">{r.description}</p>
                          <span
                            className={cn(
                              "shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium",
                              severityStyle[r.severity],
                            )}
                          >
                            {r.severity}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">Owner: {r.owner}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Block>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
