import type { Metadata } from "next";
import JobBrowser from "@/components/JobBrowser";

export const metadata: Metadata = {
  title: "Browse jobs",
  description: "Search, filter and sort every open role on HireDesk.",
};

/**
 * A Server Component shell. All the interactive work - search, filters and
 * sorting - happens inside <JobBrowser />, which is a Client Component.
 */
export default function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Open roles</h1>
        <p className="mt-2 text-slate-600">
          Find your next job. Use the filters to narrow things down by type, location and salary.
        </p>
      </div>

      <JobBrowser />
    </div>
  );
}
