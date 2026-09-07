import EditJob from "@/components/EditJob";

/** Dynamic route: /recruiter/jobs/job-001/edit */
export default async function EditJobPage({ params }: PageProps<"/recruiter/jobs/[id]/edit">) {
  const { id } = await params;
  return <EditJob jobId={id} />;
}
