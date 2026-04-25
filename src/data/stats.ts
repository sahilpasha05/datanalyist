import type { Respondent } from "./survey";

export const avg = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

export function countBy<T, K extends string>(rows: T[], key: (r: T) => K): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of rows) {
    const k = key(r);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export function topFeature(rows: Respondent[]): { name: string; count: number } {
  const c = countBy(rows, (r) => r.preferredFeature);
  let best = { name: "—", count: 0 };
  for (const [k, v] of Object.entries(c)) if (v > best.count) best = { name: k, count: v };
  return best;
}

export function highSatisfactionPct(rows: Respondent[]): number {
  if (!rows.length) return 0;
  return (rows.filter((r) => r.satisfaction >= 8).length / rows.length) * 100;
}

export function satisfactionByGender(rows: Respondent[]) {
  const groups: Record<string, number[]> = {};
  for (const r of rows) {
    (groups[r.gender] ??= []).push(r.satisfaction);
  }
  return Object.entries(groups).map(([gender, vals]) => ({
    gender,
    satisfaction: +avg(vals).toFixed(2),
  }));
}

export function ageHistogram(rows: Respondent[]) {
  const buckets = ["18–24", "25–34", "35–44", "45–54", "55–60"];
  const counts = [0, 0, 0, 0, 0];
  for (const r of rows) {
    if (r.age <= 24) counts[0]++;
    else if (r.age <= 34) counts[1]++;
    else if (r.age <= 44) counts[2]++;
    else if (r.age <= 54) counts[3]++;
    else counts[4]++;
  }
  return buckets.map((b, i) => ({ bucket: b, count: counts[i] }));
}

export function featurePopularity(rows: Respondent[]) {
  const c = countBy(rows, (r) => r.preferredFeature);
  return Object.entries(c)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count);
}

const INCOME_ORDER = ["<₹3L", "₹3–6L", "₹6–12L", "₹12–25L", "₹25L+"];
export function satisfactionByIncome(rows: Respondent[]) {
  const groups: Record<string, number[]> = {};
  for (const r of rows) (groups[r.income] ??= []).push(r.satisfaction);
  return INCOME_ORDER.map((income) => ({
    income,
    satisfaction: +avg(groups[income] ?? []).toFixed(2),
    count: (groups[income] ?? []).length,
  }));
}

export function sentimentDistribution(rows: Respondent[]) {
  const c = countBy(rows, (r) => r.sentiment);
  return [
    { name: "Positive", value: c.positive ?? 0, key: "positive" as const },
    { name: "Neutral", value: c.neutral ?? 0, key: "neutral" as const },
    { name: "Negative", value: c.negative ?? 0, key: "negative" as const },
  ];
}

// Pearson correlation
function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n === 0) return 0;
  const mx = avg(xs);
  const my = avg(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

const USAGE_RANK: Record<string, number> = { Rarely: 1, Monthly: 2, Weekly: 3, Daily: 4 };
const INCOME_RANK: Record<string, number> = {
  "<₹3L": 1,
  "₹3–6L": 2,
  "₹6–12L": 3,
  "₹12–25L": 4,
  "₹25L+": 5,
};
const EDU_RANK: Record<string, number> = {
  "High School": 1,
  "Bachelor's": 2,
  "Master's": 3,
  PhD: 4,
};

export function correlationMatrix(rows: Respondent[]) {
  const vars = {
    Age: rows.map((r) => r.age),
    Income: rows.map((r) => INCOME_RANK[r.income]),
    Education: rows.map((r) => EDU_RANK[r.education]),
    Usage: rows.map((r) => USAGE_RANK[r.usageFrequency]),
    Satisfaction: rows.map((r) => r.satisfaction),
  };
  const keys = Object.keys(vars) as (keyof typeof vars)[];
  return keys.map((a) => ({
    name: a,
    values: keys.map((b) => ({ name: b, value: +pearson(vars[a], vars[b]).toFixed(2) })),
  }));
}