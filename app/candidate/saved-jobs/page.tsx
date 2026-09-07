"use client";

import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import JobList from "@/components/JobList";
import PageHeader from "@/components/PageHeader";
import { useJobs, useSavedJobs } from "@/lib/hooks";

export default function SavedJobsPage() {
  const { savedJobIds, loaded } = useSavedJobs();
  const { jobs } = useJobs();

  // Keep the order the user saved them in (newest first).
  const savedJobs = savedJobIds
    .map((id) => jobs.find((job) => job.id === id))
    .filter((job) => job !== undefined);

  return (
    <>
      <PageHeader
        title="Saved jobs"
        description="Roles you bookmarked. Saved in this browser only."
        action={<Button href="/jobs">Find more jobs</Button>}
      />

      {!loaded ? (
        <p className="py-16 text-center text-slate-500">Loading…</p>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the bookmark icon on any job card to keep it here for later."
          action={<Button href="/jobs">Browse jobs</Button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-600">
            {savedJobs.length} saved {savedJobs.length === 1 ? "role" : "roles"}
          </p>
          <JobList jobs={savedJobs} />
        </>
      )}
    </>
  );
}
