import JobDetails from "@/components/JobDetails";

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
