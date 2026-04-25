// Hardcoded survey dataset — generated once at module load with a seeded PRNG
// so the same 500 rows exist on every render. No runtime regeneration per request.

export type Sentiment = "positive" | "neutral" | "negative";

export interface Respondent {
  id: string;
  age: number;
  gender: "Male" | "Female" | "Non-binary";
  location: string;
  education: "High School" | "Bachelor's" | "Master's" | "PhD";
  income: "<₹3L" | "₹3–6L" | "₹6–12L" | "₹12–25L" | "₹25L+";
  satisfaction: number; // 1-10
  usageFrequency: "Daily" | "Weekly" | "Monthly" | "Rarely";
  preferredFeature: string;
  feedback: string;
  sentiment: Sentiment;
}

const LOCATIONS = [
  "New York", "San Francisco", "London", "Berlin", "Toronto",
  "Sydney", "Singapore", "Amsterdam", "Austin", "Tokyo",
];
const GENDERS: Respondent["gender"][] = ["Male", "Female", "Non-binary"];
const EDUCATION: Respondent["education"][] = ["High School", "Bachelor's", "Master's", "PhD"];
const INCOME: Respondent["income"][] = ["<₹3L", "₹3–6L", "₹6–12L", "₹12–25L", "₹25L+"];
const USAGE: Respondent["usageFrequency"][] = ["Daily", "Weekly", "Monthly", "Rarely"];
const FEATURES = [
  "Advanced Analytics",
  "Custom Dashboards",
  "AI Insights",
  "Team Collaboration",
  "Automated Reports",
  "Integrations",
];

const POSITIVE_FEEDBACK = [
  "Absolutely love the dashboard — it has transformed how my team makes decisions.",
  "The AI insights feature saved us hours of manual analysis every week.",
  "Best analytics tool I've used in years. Setup was effortless.",
  "Customer support is phenomenal and the product just keeps getting better.",
  "Our reporting workflow is now 10x faster. Highly recommended.",
  "Beautiful interface, powerful features, and fair pricing. Five stars.",
  "The integrations alone are worth the price. Game changer for our org.",
  "Custom dashboards are intuitive enough that even non-technical users adopt them.",
];
const NEUTRAL_FEEDBACK = [
  "Solid product overall, though the mobile experience could use some polish.",
  "Works as advertised. Nothing groundbreaking but reliable for daily use.",
  "Decent value. Some features feel half-finished but the core is strong.",
  "Good tool but the learning curve was steeper than I expected.",
  "It does the job. I wish onboarding was a bit more guided.",
  "Performance is fine on most days, occasional slowness during peak hours.",
];
const NEGATIVE_FEEDBACK = [
  "Too expensive for what it offers — competitors do more at half the price.",
  "Frequently runs into bugs when exporting large reports. Frustrating.",
  "Documentation is sparse and support response times are too slow.",
  "The new UI update made things harder to find. Please bring back the old layout.",
  "Crashes on Safari multiple times a week. Hard to recommend.",
];

// Mulberry32 — tiny seeded PRNG so dataset is deterministic across reloads.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20250425);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

function buildRespondent(i: number): Respondent {
  const age = randInt(18, 60);
  const income = pick(INCOME);
  const education = pick(EDUCATION);

  // Bias satisfaction by income & age cohort to create realistic insights
  let baseSat = 5.5;
  if (income === "₹12–25L" || income === "₹25L+") baseSat += 1.4;
  if (age >= 25 && age <= 34) baseSat += 1.1;
  if (education === "Master's" || education === "PhD") baseSat += 0.6;
  if (age > 50) baseSat -= 0.5;
  const satisfaction = Math.max(1, Math.min(10, Math.round(baseSat + (rand() - 0.5) * 4)));

  // Feature preference correlates with income (high income → AI Insights / Analytics)
  let preferredFeature: string;
  if ((income === "₹12–25L" || income === "₹25L+") && rand() < 0.55) {
    preferredFeature = rand() < 0.5 ? "AI Insights" : "Advanced Analytics";
  } else {
    preferredFeature = pick(FEATURES);
  }

  // Sentiment from satisfaction
  let sentiment: Sentiment;
  let feedback: string;
  if (satisfaction >= 8) {
    sentiment = "positive";
    feedback = pick(POSITIVE_FEEDBACK);
  } else if (satisfaction >= 5) {
    sentiment = "neutral";
    feedback = pick(NEUTRAL_FEEDBACK);
  } else {
    sentiment = "negative";
    feedback = pick(NEGATIVE_FEEDBACK);
  }

  return {
    id: `R-${String(1000 + i)}`,
    age,
    gender: pick(GENDERS),
    location: pick(LOCATIONS),
    education,
    income,
    satisfaction,
    usageFrequency: pick(USAGE),
    preferredFeature,
    feedback,
    sentiment,
  };
}

export const RESPONDENTS: Respondent[] = Array.from({ length: 520 }, (_, i) => buildRespondent(i));

export const ALL_LOCATIONS = LOCATIONS;
export const ALL_GENDERS = GENDERS;
export const ALL_FEATURES = FEATURES;

export interface Filters {
  ageRange: [number, number];
  gender: "All" | Respondent["gender"];
  location: "All" | string;
}

export const DEFAULT_FILTERS: Filters = {
  ageRange: [18, 60],
  gender: "All",
  location: "All",
};

export function applyFilters(rows: Respondent[], f: Filters): Respondent[] {
  return rows.filter((r) => {
    if (r.age < f.ageRange[0] || r.age > f.ageRange[1]) return false;
    if (f.gender !== "All" && r.gender !== f.gender) return false;
    if (f.location !== "All" && r.location !== f.location) return false;
    return true;
  });
}