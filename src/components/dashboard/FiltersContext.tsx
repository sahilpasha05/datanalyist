import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  RESPONDENTS,
  applyFilters,
  DEFAULT_FILTERS,
  type Filters,
  type Respondent,
} from "@/data/survey";

interface Ctx {
  filters: Filters;
  setFilters: (f: Filters) => void;
  data: Respondent[];
  all: Respondent[];
}

const FiltersContext = createContext<Ctx | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const data = useMemo(() => applyFilters(RESPONDENTS, filters), [filters]);
  return (
    <FiltersContext.Provider value={{ filters, setFilters, data, all: RESPONDENTS }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}