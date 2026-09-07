"use client";

import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import Button from "@/components/Button";
import DashboardCard from "@/components/DashboardCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { formatDate } from "@/lib/format";
import { useApplications, useJobs } from "@/lib/hooks";
import { APPLICATION_STATUSES } from "@/lib/types";

export default function RecruiterDashboardPage() {
  const { jobs } = useJobs();
  const { applications, countByStatus } = useApplications();

  const counts = countByStatus(applications);
  const openJobs = jobs.filter((job) => job.status === "Open");
  const needsAction = applications.filter((application) =>
    ["Applied", "Under Review"].includes(application.status),
  );

  const recent = [...applications]
    .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
    .slice(0, 4);

  // Which roles are pulling in the most applications?
  const topJobs = openJobs
    .map((job) => ({
      job,
      count: applications.filter((application) => application.jobId === job.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const largest = Math.max(1, ...topJobs.map((entry) => entry.count));

  return (
    <>
      <PageHeader
        title="Recruiter dashboard"
        description="Everything happening across your open roles."
        action={
          <>
            <Button href="/recruiter/jobs" variant="outline">
              Manage jobs
            </Button>
            <Button href="/recruiter/jobs/new">Post a job</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          label="Open jobs"
          value={openJobs.length}
          hint={`${jobs.length} total including drafts`}
          icon="💼"
          href="/recruiter/jobs"
        />
        <DashboardCard
          label="Applications"
          value={applications.length}
          hint="Across every role"
          icon="📄"
          tone="blue"
          href="/recruiter/applications"
        />
        <DashboardCard
          label="Needs review"
          value={needsAction.length}
          hint="Applied or under review"
          icon="⏳"
          tone="amber"
        />
        <DashboardCard
          label="Hired"
          value={counts.Hired ?? 0}
          hint="Offers accepted"
          icon="🎉"
          tone="green"
        />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Pipeline by stage</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {APPLICATION_STATUSES.map((status) => (
            <Link
              key={status}
              href="/recruiter/applications"
              className="rounded-lg bg-slate-50 p-3 text-center transition hover:bg-slate-100"
            >
              <p className="text-2xl font-semibold text-slate-900">{counts[status] ?? 0}</p>
              <p className="mt-0.5 text-xs text-slate-600">{status}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest applications</h2>
            <Button href="/recruiter/applications" variant="ghost" size="sm">
              View all
            </Button>
          </div>

          {recent.length === 0 ? (
            <EmptyState title="No applications yet" />
          ) : (
            <div className="space-y-3">
              {recent.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  basePath="/recruiter/applications"
                  showCandidate
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Applications per role</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            {topJobs.length === 0 ? (
              <p className="text-sm text-slate-600">Post a job to start collecting applications.</p>
            ) : (
              <ul className="space-y-4">
                {topJobs.map(({ job, count }) => (
                  <li key={job.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <Link
                        href={`/recruiter/jobs/${job.id}/edit`}
                        className="truncate text-sm font-medium text-slate-900 hover:text-indigo-600"
                      >
                        {job.title}
                      </Link>
                      <span className="shrink-0 text-sm text-slate-600">{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(count / largest) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Posted {formatDate(job.postedDate)} &middot; {job.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
