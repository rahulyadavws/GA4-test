"use client";

import Link from "next/link";
import ApplicationForm from "./ApplicationForm";
import Badge from "./Badge";
import Button from "./Button";
import { formatSalary } from "@/lib/format";
import { useJobs } from "@/lib/hooks";

/** Looks the job up on the client, then renders the application form. */
export default function ApplyJob({ jobId }: { jobId: string }) {
  const { getJob, loaded } = useJobs();
  const job = getJob(jobId);

  if (!job && !loaded) {
    return <p className="py-20 text-center text-slate-500">Loading…</p>;
  }

  if (!job) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Job not found</h1>
        <p className="mt-2 text-slate-600">You cannot apply for a role that no longer exists.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/jobs">Back to all jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/jobs" className="hover:text-indigo-600">
          Jobs
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/jobs/${job.id}`} className="hover:text-indigo-600">
          {job.title}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Apply</span>
      </nav>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-indigo-600">Applying for</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{job.title}</h1>
        <p className="mt-1 text-slate-600">
          {job.company} &middot; {job.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="indigo">{job.jobType}</Badge>
          <Badge tone="blue">{job.workMode}</Badge>
          <Badge tone="green">{formatSalary(job)}</Badge>
        </div>
      </div>

      <ApplicationForm job={job} />
    </>
  );
}
