import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, Lightbulb, MessageSquare, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { FiltersProvider, useFilters } from "./FiltersContext";
import { ALL_LOCATIONS } from "@/data/survey";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/feedback", label: "Feedback Analysis", icon: MessageSquare },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Survey Insights</div>
          <div className="text-[11px] text-muted-foreground leading-tight">Pro · Analytics</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 p-4 rounded-xl border border-border bg-gradient-to-br from-accent/40 to-transparent">
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Pro plan
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Unlimited dashboards, AI insights & priority support.
        </p>
      </div>
    </aside>
  );
}

function Topbar() {
  const { filters, setFilters, data, all } = useFilters();
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="flex flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs text-muted-foreground">
            Showing {data.length.toLocaleString()} of {all.length.toLocaleString()} respondents
          </div>
          <div className="text-sm font-semibold">Workspace · Q4 Customer Research</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-card min-w-[220px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Age {filters.ageRange[0]}–{filters.ageRange[1]}
            </span>
            <Slider
              value={filters.ageRange}
              min={18}
              max={60}
              step={1}
              onValueChange={(v) =>
                setFilters({ ...filters, ageRange: [v[0], v[1]] as [number, number] })
              }
              className="w-32"
            />
          </div>
          <Select
            value={filters.gender}
            onValueChange={(v) => setFilters({ ...filters, gender: v as typeof filters.gender })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Non-binary">Non-binary</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.location}
            onValueChange={(v) => setFilters({ ...filters, location: v })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All locations</SelectItem>
              {ALL_LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <FiltersProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </FiltersProvider>
  );
}