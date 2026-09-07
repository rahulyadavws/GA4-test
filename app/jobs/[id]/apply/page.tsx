import type { Metadata } from "next";
import ApplyJob from "@/components/ApplyJob";
import { SEED_JOBS } from "@/lib/jobs";

export async function generateMetadata({
  params,
}: PageProps<"/jobs/[id]/apply">): Promise<Metadata> {
  const { id } = await params;
  const job = SEED_JOBS.find((seedJob) => seedJob.id === id);

  return {
    title: job ? `Apply for ${job.title}` : "Apply for a job",
    description: "Send your application - it takes a couple of minutes.",
  };
}

/**
 * Dynamic route: /jobs/job-001/apply
 *
 * Open to everyone - there is no candidate login in this demo. Submitted
 * applications belong to the sample candidate in lib/candidates.ts.
 */
export default async function ApplyPage({ params }: PageProps<"/jobs/[id]/apply">) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <ApplyJob jobId={id} />
    </div>
  );
}
