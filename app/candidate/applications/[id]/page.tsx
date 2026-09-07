import CandidateApplicationDetails from "@/components/CandidateApplicationDetails";

/** Dynamic route: /candidate/applications/app-001 */
export default async function CandidateApplicationPage({
  params,
}: PageProps<"/candidate/applications/[id]">) {
  const { id } = await params;
  return <CandidateApplicationDetails id={id} />;
}
