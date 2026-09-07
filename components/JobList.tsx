import EmptyState from "./EmptyState";
import JobCard from "./JobCard";
import type { Job } from "@/lib/types";

/** Renders a responsive grid of job cards, or an empty state. */
export default function JobList({
  jobs,
  columns = 2,
  emptyTitle = "No jobs found",
  emptyDescription = "Try changing your search or clearing some filters.",
}: {
  jobs: Job[];
  columns?: 1 | 2 | 3;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (jobs.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 lg:grid-cols-2";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
