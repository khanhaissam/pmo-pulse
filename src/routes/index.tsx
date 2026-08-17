import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HealthOverview } from "@/components/pmo/HealthOverview";
import { ManagementAttention } from "@/components/pmo/ManagementAttention";
import { ProgressOverview } from "@/components/pmo/ProgressOverview";
import { ProjectDetail } from "@/components/pmo/ProjectDetail";
import { ProjectTable } from "@/components/pmo/ProjectTable";
import { SummaryCards, type SummaryFilter } from "@/components/pmo/SummaryCards";
import { TopRisks } from "@/components/pmo/TopRisks";
import { UpcomingMilestones } from "@/components/pmo/UpcomingMilestones";
import { portfolioRisks, projects, type Project } from "@/data/portfolio";
import { getPortfolioSummary } from "@/lib/portfolio-metrics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PMO Pulse — Project Portfolio Health Dashboard" },
      {
        name: "description",
        content:
          "PMO Pulse gives PMO leaders portfolio health at a glance: project status, risks, progress and upcoming milestones in one view.",
      },
      { property: "og:title", content: "PMO Pulse — Portfolio health at a glance" },
      {
        property: "og:description",
        content:
          "Portfolio dashboard showing project health, top risks, progress and milestones for PMO leaders and project directors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const summary = getPortfolioSummary(projects);
  const [cardFilter, setCardFilter] = useState<SummaryFilter>("all");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    switch (cardFilter) {
      case "green":
        return projects.filter((p) => p.overallHealth === "Green");
      case "amber":
        return projects.filter((p) => p.overallHealth === "Amber");
      case "red":
        return projects.filter((p) => p.overallHealth === "Red");
      case "overdue":
        return projects.filter((p) => p.overdueActions > 0);
      default:
        return projects;
    }
  }, [cardFilter]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">PMO Pulse</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Portfolio health at a glance</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
        <SummaryCards
          summary={summary}
          activeFilter={cardFilter}
          onFilterChange={setCardFilter}
        />

        <ManagementAttention projects={projects} onSelectProject={setSelected} />

        <div className="grid gap-5 lg:grid-cols-2">
          <HealthOverview projects={projects} />
          <ProgressOverview projects={projects} />
        </div>

        <ProjectTable projects={filtered} onSelectProject={setSelected} />

        <div className="grid gap-5 lg:grid-cols-2">
          <TopRisks risks={portfolioRisks} projects={projects} />
          <UpcomingMilestones projects={projects} />
        </div>
      </main>

      <ProjectDetail
        project={selected}
        risks={portfolioRisks}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
