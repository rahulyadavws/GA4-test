"use client";

import Link from "next/link";
import Badge from "./Badge";
import Button from "./Button";
import JobCard from "./JobCard";
import { formatDate, formatSalary, timeAgo } from "@/lib/format";
import { useApplications, useJobs } from "@/lib/hooks";

/** A labelled row in the "Job overview" sidebar box. */
function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

/** A bulleted list with a heading, used for requirements and benefits. */
function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The job detail view. It is a Client Component because the job list can be
 * edited by recruiters and lives in localStorage.
 */
export default function JobDetails({ jobId }: { jobId: string }) {
  const { getJob, openJobs, loaded } = useJobs();
  const { hasApplied } = useApplications();

  const job = getJob(jobId);

  // The server render only knows about the seed jobs, so wait until the
  // browser has read localStorage before deciding a job really is missing.
  if (!job && !loaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-500 sm:px-6 lg:px-8">
        Loading job…
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Job not found</h1>
        <p className="mt-2 text-slate-600">
          This role may have been closed or removed by the recruiter.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/jobs">Back to all jobs</Button>
        </div>
      </div>
    );
  }

  const applied = hasApplied(job.id);
  const closed = job.status !== "Open";

  const similarJobs = openJobs
    .filter((other) => other.id !== job.id && other.department === job.department)
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/jobs" className="hover:text-indigo-600">
          Jobs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{job.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* Header */}
          <header className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  {job.title}
                </h1>
                <p className="mt-1 text-slate-600">
                  {job.company} &middot; {job.location}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Posted {timeAgo(job.postedDate)} &middot; {job.openings}{" "}
                  {job.openings === 1 ? "opening" : "openings"}
                </p>
              </div>
              {closed && <Badge tone="red">Closed</Badge>}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="indigo">{job.jobType}</Badge>
              <Badge tone="blue">{job.workMode}</Badge>
              <Badge tone="slate">{job.experience}</Badge>
              <Badge tone="green">{formatSalary(job)}</Badge>
              <Badge tone="purple">{job.department}</Badge>
            </div>
          </header>

          <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-6">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">About the role</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{job.description}</p>
            </section>

            <BulletSection title="Requirements" items={job.requirements} />
            <BulletSection title="Benefits" items={job.benefits} />

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} tone="slate">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {similarJobs.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Similar roles</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {similarJobs.map((similar) => (
                  <JobCard key={similar.id} job={similar} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">Salary range</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{formatSalary(job)}</p>

            <div className="mt-5 space-y-2">
              {applied ? (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200">
                  You have already applied
                </div>
              ) : closed ? (
                <div className="rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-600">
                  Applications are closed
                </div>
              ) : (
                <Button href={`/jobs/${job.id}/apply`} fullWidth size="lg">
                  Apply now
                </Button>
              )}
            </div>

            <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100 pt-2">
              <OverviewRow label="Job type" value={job.jobType} />
              <OverviewRow label="Work mode" value={job.workMode} />
              <OverviewRow label="Experience" value={job.experience} />
              <OverviewRow label="Level" value={job.experienceLevel} />
              <OverviewRow label="Department" value={job.department} />
              <OverviewRow label="Location" value={job.location} />
              <OverviewRow label="Openings" value={String(job.openings)} />
              <OverviewRow label="Posted on" value={formatDate(job.postedDate)} />
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
