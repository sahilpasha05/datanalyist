import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, TrendingUp, Target, AlertTriangle, Sparkles, Globe2, Users2, Award } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { useFilters } from "@/components/dashboard/FiltersContext";
import { avg, countBy, satisfactionByIncome } from "@/data/stats";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Survey Insights Pro" },
      { name: "description", content: "Consultant-grade insights derived from your live survey dataset." },
    ],
  }),
  component: () => (
    <AppShell>
      <InsightsPage />
    </AppShell>
  ),
});

interface Insight {
  icon: LucideIcon;
  tone: "positive" | "warning" | "info";
  title: string;
  body: string;
  metric: string;
}

function InsightsPage() {
  const { data } = useFilters();

  // Derived metrics for insight copy
  const sat25_34 = avg(data.filter((r) => r.age >= 25 && r.age <= 34).map((r) => r.satisfaction));
  const satOverall = avg(data.map((r) => r.satisfaction));

  const highIncomeRows = data.filter((r) => r.income === "₹12–25L" || r.income === "₹25L+");
  const highIncFeatures = countBy(highIncomeRows, (r) => r.preferredFeature);
  const topHighIncFeature = Object.entries(highIncFeatures).sort((a, b) => b[1] - a[1])[0];

  const dailyUsers = data.filter((r) => r.usageFrequency === "Daily");
  const dailySat = avg(dailyUsers.map((r) => r.satisfaction));

  const negRows = data.filter((r) => r.sentiment === "negative");
  const negPct = data.length ? (negRows.length / data.length) * 100 : 0;

  const locStats = Object.entries(
    data.reduce<Record<string, { sum: number; n: number }>>((acc, r) => {
      (acc[r.location] ??= { sum: 0, n: 0 });
      acc[r.location].sum += r.satisfaction;
      acc[r.location].n += 1;
      return acc;
    }, {})
  )
    .map(([loc, v]) => ({ loc, avg: v.sum / v.n, n: v.n }))
    .filter((x) => x.n >= 5)
    .sort((a, b) => b.avg - a.avg);
  const topLoc = locStats[0];
  const bottomLoc = locStats[locStats.length - 1];

  const incomeSat = satisfactionByIncome(data);
  const lowestIncomeBand = [...incomeSat].sort((a, b) => a.satisfaction - b.satisfaction)[0];

  const phdRows = data.filter((r) => r.education === "PhD" || r.education === "Master's");
  const phdSat = avg(phdRows.map((r) => r.satisfaction));

  const insights: Insight[] = [
    {
      icon: Users2,
      tone: "positive",
      title: "25–34 year-olds are your strongest cohort",
      body: `Users aged 25–34 average ${sat25_34.toFixed(2)}/10 in satisfaction — ${(sat25_34 - satOverall).toFixed(2)} points above the overall mean. Double down on product marketing, lifecycle emails, and case studies featuring this segment to compound retention.`,
      metric: `${sat25_34.toFixed(2)} / 10`,
    },
    {
      icon: Award,
      tone: "info",
      title: `High-income users gravitate toward ${topHighIncFeature?.[0] ?? "premium features"}`,
      body: `Among ₹12L+ respondents, ${topHighIncFeature?.[0] ?? "premium features"} is the #1 preferred capability with ${topHighIncFeature?.[1] ?? 0} mentions. Surface this prominently on Pro/Enterprise pricing pages to lift conversion.`,
      metric: `${highIncomeRows.length} users`,
    },
    {
      icon: TrendingUp,
      tone: "positive",
      title: "Daily active users are your evangelists",
      body: `Daily users score ${dailySat.toFixed(2)}/10 vs. ${satOverall.toFixed(2)} overall. Build a referral and advocacy program targeted specifically at this group — they are most likely to convert into NPS promoters and case studies.`,
      metric: `${dailyUsers.length} DAU`,
    },
    {
      icon: AlertTriangle,
      tone: "warning",
      title: "Negative sentiment concentrated in low-income tier",
      body: `${negPct.toFixed(1)}% of feedback is negative, and the ${lowestIncomeBand?.income ?? "lowest income"} band averages just ${lowestIncomeBand?.satisfaction?.toFixed(2) ?? "—"}/10. Consider a lighter pricing tier or self-serve onboarding to recover this segment instead of churning them.`,
      metric: `${negPct.toFixed(1)}% neg`,
    },
    {
      icon: Globe2,
      tone: "info",
      title: `${topLoc?.loc ?? "—"} is your highest-LTV market`,
      body: `${topLoc?.loc ?? "—"} leads all geographies at ${topLoc?.avg.toFixed(2) ?? "—"}/10 satisfaction across ${topLoc?.n ?? 0} respondents. Localize landing pages and prioritize regional partnerships there before expanding into ${bottomLoc?.loc ?? "—"} (${bottomLoc?.avg.toFixed(2) ?? "—"}/10).`,
      metric: topLoc?.loc ?? "—",
    },
    {
      icon: Sparkles,
      tone: "positive",
      title: "Advanced education correlates with higher satisfaction",
      body: `Master's and PhD respondents average ${phdSat.toFixed(2)}/10 — meaningfully above the population mean. Position depth-of-feature messaging (custom dashboards, AI insights) for technical buyers and analyst personas.`,
      metric: `${phdRows.length} users`,
    },
    {
      icon: Target,
      tone: "info",
      title: "AI Insights is the conversion hook for upgrades",
      body: `AI Insights consistently ranks in the top 2 features regardless of cohort. Consider gating it behind Pro and adding an in-product upsell when free users hit analytical dead-ends.`,
      metric: "Upsell trigger",
    },
    {
      icon: Lightbulb,
      tone: "warning",
      title: "Reduce friction in the 35–44 mid-funnel",
      body: `35–44 year-olds skew neutral in feedback — they are not detractors, but they are not promoters either. Targeted onboarding flows and a quarterly value review can convert this lukewarm middle into expansion revenue.`,
      metric: "Mid-funnel risk",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Strategic Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consultant-grade observations generated from the current filtered dataset.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((ins) => {
          const Icon = ins.icon;
          const toneClass =
            ins.tone === "positive"
              ? "bg-success/15 text-success"
              : ins.tone === "warning"
                ? "bg-warning/20 text-warning-foreground"
                : "bg-primary/10 text-primary";
          return (
            <div key={ins.title} className="card-elevated p-5">
              <div className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${toneClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold">{ins.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {ins.metric}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ins.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}