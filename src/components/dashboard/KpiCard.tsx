import type { LucideIcon } from "lucide-react";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </div>
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-medium ${
              trend.positive ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.positive ? "▲" : "▼"} {trend.value}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}