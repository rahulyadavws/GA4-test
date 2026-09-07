"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import JobForm, { type JobFormResult } from "./JobForm";
import PageHeader from "./PageHeader";
import { formatDate } from "@/lib/format";
import { useApplications, useJobs } from "@/lib/hooks";

export default function EditJob({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { getJob, updateJob, deleteJob, loaded } = useJobs();
  const { applications } = useApplications();

  const job = getJob(jobId);

  if (!job && !loaded) return <p className="py-16 text-center text-slate-500">Loading…</p>;

  if (!job) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Job not found</h1>
        <p className="mt-2 text-slate-600">It may already have been deleted.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/recruiter/jobs">Back to manage jobs</Button>
        </div>
      </div>
    );
  }

  const applicantCount = applications.filter((a) => a.jobId === job.id).length;

  function handleSave(result: JobFormResult) {
    updateJob(jobId, result);
    router.push("/recruiter/jobs");
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${job?.title}"? This cannot be undone.`);
    if (!confirmed) return;
    deleteJob(jobId);
    router.push("/recruiter/jobs");
  }

  return (
    <>
      <PageHeader
        title="Edit job"
        description={`Posted ${formatDate(job.postedDate)} · ${applicantCount} ${
          applicantCount === 1 ? "applicant" : "applicants"
        } so far.`}
        action={
          <>
            <Button href={`/jobs/${job.id}`} variant="outline">
              View public page
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete job
            </Button>
          </>
        }
      />
      <JobForm
        job={job}
        onSave={handleSave}
        submitLabel="Save changes"
        cancelHref="/recruiter/jobs"
      />
    </>
  );
}
