"use client";

import { useMemo, useState } from "react";
import FilterPanel, {
  ALL_LOCATIONS,
  EMPTY_FILTERS,
  type JobFilters,
} from "./FilterPanel";
import JobList from "./JobList";
import SearchBar from "./SearchBar";
import { useJobs } from "@/lib/hooks";
import type { Job } from "@/lib/types";

type SortOption = "newest" | "oldest" | "salary-high" | "salary-low" | "title";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  "salary-high": "Salary: high to low",
  "salary-low": "Salary: low to high",
  title: "Title: A to Z",
};

/** Keeps a job only if it matches the search text. */
function matchesSearch(job: Job, search: string) {
  if (!search.trim()) return true;
  const needle = search.trim().toLowerCase();
  return (
    job.title.toLowerCase().includes(needle) ||
    job.company.toLowerCase().includes(needle) ||
    job.location.toLowerCase().includes(needle) ||
    job.skills.some((skill) => skill.toLowerCase().includes(needle))
  );
}

/** Keeps a job only if it matches every active filter. */
function matchesFilters(job: Job, filters: JobFilters) {
  if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) return false;
  if (filters.workModes.length > 0 && !filters.workModes.includes(job.workMode)) return false;
  if (
    filters.experienceLevels.length > 0 &&
    !filters.experienceLevels.includes(job.experienceLevel)
  ) {
    return false;
  }
  if (filters.location !== ALL_LOCATIONS && job.location !== filters.location) return false;
  if (job.salaryMax < filters.minSalary) return false;
  return true;
}

function sortJobs(jobs: Job[], sort: SortOption) {
  // Copy first - sort() changes the array in place.
  const sorted = [...jobs];
  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => a.postedDate.localeCompare(b.postedDate));
    case "salary-high":
      return sorted.sort((a, b) => b.salaryMax - a.salaryMax);
    case "salary-low":
      return sorted.sort((a, b) => a.salaryMin - b.salaryMin);
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return sorted.sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }
}

/**
 * The whole job board: search box, filter sidebar, sort dropdown and results.
 * This is a Client Component because it holds interactive state.
 */
export default function JobBrowser({ initialSearch = "" }: { initialSearch?: string }) {
  const { openJobs } = useJobs();
  // Seeded from the ?q= term the home page search box sends over.
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<JobFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Locations come from the jobs themselves, so new jobs appear in the filter.
  const locations = useMemo(
    () => Array.from(new Set(openJobs.map((job) => job.location))).sort(),
    [openJobs],
  );

  const visibleJobs = useMemo(() => {
    const filtered = openJobs.filter(
      (job) => matchesSearch(job, search) && matchesFilters(job, filters),
    );
    return sortJobs(filtered, sort);
  }, [openJobs, search, filters, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar - always visible on large screens, toggled on mobile */}
      <div className={showFilters ? "block" : "hidden lg:block"}>
        <FilterPanel filters={filters} onChange={setFilters} locations={locations} />
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((open) => !open)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 lg:hidden"
          >
            {showFilters ? "Hide filters" : "Show filters"}
          </button>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label="Sort jobs"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{visibleJobs.length}</span> of{" "}
          {openJobs.length} open roles
        </p>

        <JobList jobs={visibleJobs} />
      </div>
    </div>
  );
}
