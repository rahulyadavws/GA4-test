"use client";

import { useRouter } from "next/navigation";
import JobForm, { type JobFormResult } from "@/components/JobForm";
import PageHeader from "@/components/PageHeader";
import { useJobs } from "@/lib/hooks";

export default function CreateJobPage() {
  const router = useRouter();
  const { createJob } = useJobs();

  function handleSave(result: JobFormResult) {
    createJob(result);
    router.push("/recruiter/jobs");
  }

  return (
    <>
      <PageHeader
        title="Post a job"
        description="Fill this in and the role appears on the public job board straight away."
      />
      <JobForm onSave={handleSave} submitLabel="Publish job" cancelHref="/recruiter/jobs" />
    </>
  );
}
