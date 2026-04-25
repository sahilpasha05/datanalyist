import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ReactNode } from "react";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-elevated p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "var(--shadow-elevated)",
  },
  labelStyle: { color: "var(--color-foreground)", fontWeight: 600 },
};

export function SatisfactionByGenderChart({ data }: { data: { gender: string; satisfaction: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="gender" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="satisfaction" radius={[8, 8, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AgeHistogramChart({ data }: { data: { bucket: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function FeaturePopularityChart({ data }: { data: { feature: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis dataKey="feature" type="category" width={130} tick={{ fontSize: 12, fill: "var(--color-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function IncomeSatisfactionChart({
  data,
}: {
  data: { income: string; satisfaction: number; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="income" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="satisfaction" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SentimentPieChart({
  data,
}: {
  data: { name: string; value: number; key: "positive" | "neutral" | "negative" }[];
}) {
  const COLORS: Record<string, string> = {
    positive: "var(--success)",
    neutral: "var(--chart-2)",
    negative: "var(--chart-5)",
  };
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {data.map((d) => (
            <Cell key={d.key} fill={COLORS[d.key]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CorrelationHeatmap({
  matrix,
}: {
  matrix: { name: string; values: { name: string; value: number }[] }[];
}) {
  const cellColor = (v: number) => {
    // -1 (red) → 0 (neutral) → 1 (primary)
    const abs = Math.abs(v);
    const hue = v >= 0 ? "270" : "25";
    const lightness = 0.96 - abs * 0.45;
    const chroma = 0.05 + abs * 0.18;
    return `oklch(${lightness} ${chroma} ${hue})`;
  };
  const labels = matrix.map((m) => m.name);
  return (
    <div className="overflow-x-auto">
      <table className="text-xs border-separate border-spacing-1">
        <thead>
          <tr>
            <th></th>
            {labels.map((l) => (
              <th key={l} className="px-2 py-1 text-muted-foreground font-medium">
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr key={row.name}>
              <td className="pr-2 text-muted-foreground font-medium text-right">{row.name}</td>
              {row.values.map((c) => (
                <td
                  key={c.name}
                  className="w-16 h-12 text-center rounded-md font-medium"
                  style={{
                    background: cellColor(c.value),
                    color: Math.abs(c.value) > 0.5 ? "white" : "var(--color-foreground)",
                  }}
                >
                  {c.value.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}