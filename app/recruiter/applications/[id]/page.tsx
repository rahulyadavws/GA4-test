import RecruiterApplicationDetails from "@/components/RecruiterApplicationDetails";

/** Dynamic route: /recruiter/applications/app-001 */
export default async function RecruiterApplicationPage({
  params,
}: PageProps<"/recruiter/applications/[id]">) {
  const { id } = await params;
  return <RecruiterApplicationDetails id={id} />;
}
