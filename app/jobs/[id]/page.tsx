import type { Metadata } from "next";
import JobDetails from "@/components/JobDetails";
import { SEED_JOBS } from "@/lib/jobs";

/**
 * Gives each job page its own browser title, e.g.
 * "Senior Frontend Engineer at Nimbus Labs | HireDesk".
 *
 * This runs on the server, which only knows the seed jobs - a role a recruiter
 * created in the browser falls back to a generic title.
 */
export async function generateMetadata({ params }: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = SEED_JOBS.find((seedJob) => seedJob.id === id);

  if (!job) return { title: "Job details" };

  return {
    title: `${job.title} at ${job.company}`,
    description: job.description.slice(0, 155),
  };
}

/**
 * Dynamic route: /jobs/job-001
 *
 * This is a Server Component. In Next.js `params` is a Promise, so it has to
 * be awaited before the id can be read.
 */
export default async function JobDetailsPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  return <JobDetails jobId={id} />;
}
