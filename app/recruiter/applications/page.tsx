"use client";

import { useMemo, useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { useApplications, useJobs } from "@/lib/hooks";
import { APPLICATION_STATUSES } from "@/lib/types";

const ALL = "All";
type SortOption = "newest" | "oldest" | "name";

export default function RecruiterApplicationsPage() {
  const { applications, countByStatus } = useApplications();
  const { jobs } = useJobs();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [jobId, setJobId] = useState<string>(ALL);
  const [sort, setSort] = useState<SortOption>("newest");

  const counts = countByStatus(applications);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const matchesStatus = status === ALL || application.status === status;
      const matchesJob = jobId === ALL || application.jobId === jobId;
      const matchesSearch =
        !needle ||
        application.candidateName.toLowerCase().includes(needle) ||
        application.candidateEmail.toLowerCase().includes(needle) ||
        application.jobTitle.toLowerCase().includes(needle);
      return matchesStatus && matchesJob && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.candidateName.localeCompare(b.candidateName);
      if (sort === "oldest") return a.appliedDate.localeCompare(b.appliedDate);
      return b.appliedDate.localeCompare(a.appliedDate);
    });
  }, [applications, search, status, jobId, sort]);

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every application across all of your roles."
      />

      <div className="mb-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by candidate name, email or job title"
            />
          </div>

          <select
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
            aria-label="Filter by job"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value={ALL}>All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            aria-label="Sort applications"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Candidate A-Z</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[ALL, ...APPLICATION_STATUSES].map((tab) => {
            const count = tab === ALL ? applications.length : (counts[tab] ?? 0);
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatus(tab)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  status === tab
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
                <span className="ml-1.5 text-xs text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No applications match"
          description="Try clearing the search box or picking a different status."
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{visible.length}</span> of{" "}
            {applications.length} applications
          </p>
          <div className="space-y-3">
            {visible.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                basePath="/recruiter/applications"
                showCandidate
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
