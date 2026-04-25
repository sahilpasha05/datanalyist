import { createFileRoute } from "@tanstack/react-router";
import { Users, Star, Trophy, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { useFilters } from "@/components/dashboard/FiltersContext";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  AgeHistogramChart,
  ChartCard,
  CorrelationHeatmap,
  FeaturePopularityChart,
  IncomeSatisfactionChart,
  SatisfactionByGenderChart,
} from "@/components/dashboard/Charts";
import {
  ageHistogram,
  avg,
  correlationMatrix,
  featurePopularity,
  highSatisfactionPct,
  satisfactionByGender,
  satisfactionByIncome,
  topFeature,
} from "@/data/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Survey Insights Pro" },
      { name: "description", content: "Real-time KPIs, satisfaction trends, feature popularity and correlations across 500+ survey respondents." },
    ],
  }),
  component: () => (
    <AppShell>
      <DashboardPage />
    </AppShell>
  ),
});

function DashboardPage() {
  const { data } = useFilters();
  const top = topFeature(data);
  const meanSat = avg(data.map((r) => r.satisfaction));
  const highPct = highSatisfactionPct(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customer Insights Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Live view of respondent behavior, satisfaction, and feature preferences.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Respondents"
          value={data.length.toLocaleString()}
          icon={Users}
          trend={{ value: "+12.4%", positive: true }}
          hint="vs last quarter"
        />
        <KpiCard
          label="Avg. Satisfaction"
          value={`${meanSat.toFixed(2)} / 10`}
          icon={Star}
          trend={{ value: "+0.6", positive: true }}
          hint="QoQ change"
        />
        <KpiCard
          label="Most Popular Feature"
          value={top.name}
          icon={Trophy}
          hint={`${top.count} mentions`}
        />
        <KpiCard
          label="High Satisfaction"
          value={`${highPct.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: "+4.1pp", positive: true }}
          hint="users scoring 8+"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <ChartCard title="Satisfaction by Gender" description="Mean satisfaction score per cohort">
          <SatisfactionByGenderChart data={satisfactionByGender(data)} />
        </ChartCard>
        <ChartCard title="Age Distribution" description="Respondent count by age band">
          <AgeHistogramChart data={ageHistogram(data)} />
        </ChartCard>
        <ChartCard title="Feature Popularity" description="Preferred feature among respondents">
          <FeaturePopularityChart data={featurePopularity(data)} />
        </ChartCard>
        <ChartCard title="Income vs. Satisfaction" description="Average satisfaction across income bands">
          <IncomeSatisfactionChart data={satisfactionByIncome(data)} />
        </ChartCard>
      </div>

      <ChartCard
        title="Correlation Heatmap"
        description="Pearson correlation across key behavioral dimensions"
      >
        <CorrelationHeatmap matrix={correlationMatrix(data)} />
      </ChartCard>
    </div>
  );
}
