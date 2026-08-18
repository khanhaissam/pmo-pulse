import { cn } from "@/lib/utils";
import type { Health } from "@/data/portfolio";
import { overallLabel } from "@/lib/status-labels";

const styles: Record<Health, string> = {
  Green: "bg-status-green-soft text-status-green",
  Amber: "bg-status-amber-soft text-status-amber",
  Red: "bg-status-red-soft text-status-red",
};

const dot: Record<Health, string> = {
  Green: "bg-status-green",
  Amber: "bg-status-amber",
  Red: "bg-status-red",
};

export function StatusPill({
  health,
  label,
  className,
}: {
  health: Health;
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        styles[health],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot[health])} aria-hidden />
      {label ?? overallLabel[health]}
    </span>
  );
}

/**
 * Colour dot plus meaningful status text. `label` carries the semantic wording
 * (e.g. "Behind Schedule", "Forecast +11.2% above budget").
 */
export function StatusDot({
  health,
  label,
  srLabel,
}: {
  health: Health;
  label: string;
  srLabel?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-2.5 rounded-full", dot[health])} aria-hidden />
      <span className="text-xs text-muted-foreground">{label}</span>
      {srLabel && <span className="sr-only">{srLabel}</span>}
    </span>
  );
}
