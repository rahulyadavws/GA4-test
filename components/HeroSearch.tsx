"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const POPULAR = ["React", "Python", "Design", "Remote", "Internship"];

/**
 * The search box in the home page hero. Submitting sends you to /jobs with the
 * term in the URL, which the job board picks up as its starting search.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function goToJobs(term: string) {
    const trimmed = term.trim();
    router.push(trimmed ? `/jobs?q=${encodeURIComponent(trimmed)}` : "/jobs");
  }

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          goToJobs(query);
        }}
        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Job title, company or skill"
            aria-label="Search jobs"
            className="w-full rounded-lg border-0 bg-transparent py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Search jobs
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-500">Popular:</span>
        {POPULAR.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => goToJobs(term)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
