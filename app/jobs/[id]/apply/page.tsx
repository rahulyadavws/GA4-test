import ApplyJob from "@/components/ApplyJob";
import RequireRole from "@/components/RequireRole";

/**
 * Dynamic route: /jobs/job-001/apply
 *
 * Applying needs a candidate login. Every application is tagged with the
 * signed-in user's id, which is how "My applications" knows what is yours.
 */
export default async function ApplyPage({ params }: PageProps<"/jobs/[id]/apply">) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <RequireRole
        role="candidate"
        title="Log in to apply"
        body="Applications are tied to your account so you can track what you applied for and see the recruiter's updates. It takes a moment to sign up."
      >
        <ApplyJob jobId={id} />
      </RequireRole>
    </div>
  );
}
