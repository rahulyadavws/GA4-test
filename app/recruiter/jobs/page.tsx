"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { formatDate, formatSalary } from "@/lib/format";
import { useApplications, useJobs } from "@/lib/hooks";
import type { JobStatus } from "@/lib/types";

const STATUS_TABS: (JobStatus | "All")[] = ["All", "Open", "Draft", "Closed"];

const STATUS_TONES: Record<JobStatus, "green" | "amber" | "slate"> = {
  Open: "green",
  Draft: "amber",
  Closed: "slate",
};

export default function ManageJobsPage() {
  const { jobs, deleteJob } = useJobs();
  const { applications } = useApplications();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "All">("All");

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return jobs
      .filter((job) => {
        const matchesStatus = status === "All" || job.status === status;
        const matchesSearch =
          !needle ||
          job.title.toLowerCase().includes(needle) ||
          job.company.toLowerCase().includes(needle) ||
          job.location.toLowerCase().includes(needle);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }, [jobs, search, status]);

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"? Applications already received will stay, but the job will be gone.`,
    );
    if (confirmed) deleteJob(id);
  }

  return (
    <>
      <PageHeader
        title="Manage jobs"
        description="Create, edit and close the roles you are hiring for."
        action={<Button href="/recruiter/jobs/new">Post a job</Button>}
      />

      <div className="mb-5 space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search your jobs by title, company or location"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => {
            const count = tab === "All" ? jobs.length : jobs.filter((j) => j.status === tab).length;
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
          title="No jobs to show"
          description="Post your first role and it will appear here."
          action={<Button href="/recruiter/jobs/new">Post a job</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Table on large screens, stacked cards on small ones */}
          <div className="hidden lg:block">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Salary</th>
                  <th className="px-5 py-3 font-medium">Applicants</th>
                  <th className="px-5 py-3 font-medium">Posted</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((job) => {
                  const applicants = applications.filter((a) => a.jobId === job.id).length;
                  return (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="font-medium text-slate-900 hover:text-indigo-600"
                        >
                          {job.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {job.company} &middot; {job.location} &middot; {job.jobType}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={STATUS_TONES[job.status]}>{job.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{formatSalary(job)}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{applicants}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(job.postedDate)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/recruiter/jobs/${job.id}/edit`}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(job.id, job.title)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-slate-100 lg:hidden">
            {visible.map((job) => {
              const applicants = applications.filter((a) => a.jobId === job.id).length;
              return (
                <li key={job.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-medium text-slate-900 hover:text-indigo-600"
                      >
                        {job.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {job.company} &middot; {job.location}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONES[job.status]}>{job.status}</Badge>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {formatSalary(job)} &middot; {applicants}{" "}
                    {applicants === 1 ? "applicant" : "applicants"} &middot; Posted{" "}
                    {formatDate(job.postedDate)}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/recruiter/jobs/${job.id}/edit`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id, job.title)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
