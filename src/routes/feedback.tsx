import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/dashboard/AppShell";
import { useFilters } from "@/components/dashboard/FiltersContext";
import { ChartCard, SentimentPieChart } from "@/components/dashboard/Charts";
import { sentimentDistribution } from "@/data/stats";
import { Input } from "@/components/ui/input";
import type { Sentiment } from "@/data/survey";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback Analysis — Survey Insights Pro" },
      { name: "description", content: "Sentiment classification and live feedback exploration across all responses." },
    ],
  }),
  component: () => (
    <AppShell>
      <FeedbackPage />
    </AppShell>
  ),
});

const SENT_STYLES: Record<Sentiment, string> = {
  positive: "bg-success/15 text-success",
  neutral: "bg-muted text-muted-foreground",
  negative: "bg-destructive/10 text-destructive",
};

function FeedbackPage() {
  const { data } = useFilters();
  const dist = sentimentDistribution(data);
  const total = data.length || 1;

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | Sentiment>("all");

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (tab !== "all" && r.sentiment !== tab) return false;
      if (query && !r.feedback.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [data, tab, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback & Sentiment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every comment classified by sentiment so you can act on the signal, not the noise.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sentiment Distribution" description="Across the filtered dataset" className="lg:col-span-1">
          <SentimentPieChart data={dist} />
          <div className="mt-3 space-y-1.5 text-xs">
            {dist.map((d) => (
              <div key={d.key} className="flex items-center justify-between">
                <span className="capitalize text-muted-foreground">{d.name}</span>
                <span className="font-medium">
                  {d.value} <span className="text-muted-foreground">({((d.value / total) * 100).toFixed(1)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="card-elevated p-5 lg:col-span-2 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold">Feedback Stream</h3>
              <p className="text-xs text-muted-foreground">{filtered.length.toLocaleString()} comments</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search feedback…"
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            {(["all", "positive", "neutral", "negative"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filtered.slice(0, 60).map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{r.id}</span>
                    <span>·</span>
                    <span>{r.location}</span>
                    <span>·</span>
                    <span>{r.age}y {r.gender}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${SENT_STYLES[r.sentiment]}`}>
                    {r.sentiment} · {r.satisfaction}/10
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground leading-relaxed">{r.feedback}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-12">
                No feedback matches your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}