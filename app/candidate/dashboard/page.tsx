"use client";

import ApplicationCard from "@/components/ApplicationCard";
import Button from "@/components/Button";
import DashboardCard from "@/components/DashboardCard";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import { useApplications, useProfile, useSavedJobs } from "@/lib/hooks";
import { APPLICATION_STATUSES } from "@/lib/types";

export default function CandidateDashboardPage() {
  const { profile } = useProfile();
  const { myApplications, countByStatus } = useApplications();
  const { savedJobIds } = useSavedJobs();

  const counts = countByStatus(myApplications);
  const inProgress = myApplications.filter((application) =>
    ["Applied", "Under Review", "Shortlisted", "Interview"].includes(application.status),
  ).length;

  return (
    <>
      <PageHeader
        title={`Hello, ${profile.fullName.split(" ")[0]}`}
        description="Here is where your job search stands today."
        action={<Button href="/jobs">Find new roles</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          label="Applications"
          value={myApplications.length}
          hint="Submitted so far"
          icon="📄"
          href="/candidate/applications"
        />
        <DashboardCard
          label="In progress"
          value={inProgress}
          hint="Not yet decided"
          icon="⏳"
          tone="amber"
        />
        <DashboardCard
          label="Interviews"
          value={counts.Interview ?? 0}
          hint="Scheduled or completed"
          icon="🗓️"
          tone="blue"
        />
        <DashboardCard
          label="Saved jobs"
          value={savedJobIds.length}
          hint="Bookmarked for later"
          icon="🔖"
          tone="green"
          href="/candidate/saved-jobs"
        />
      </div>

      {/* Status breakdown */}
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">Application pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {APPLICATION_STATUSES.map((status) => (
            <div key={status} className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-2xl font-semibold text-slate-900">{counts[status] ?? 0}</p>
              <p className="mt-0.5 text-xs text-slate-600">{status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent applications */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent applications</h2>
          <Button href="/candidate/applications" variant="ghost" size="sm">
            View all
          </Button>
        </div>

        {myApplications.length === 0 ? (
          <EmptyState
            title="You have not applied anywhere yet"
            description="Browse the open roles and send your first application."
            action={<Button href="/jobs">Browse jobs</Button>}
          />
        ) : (
          <div className="space-y-3">
            {myApplications.slice(0, 3).map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                basePath="/candidate/applications"
              />
            ))}
          </div>
        )}
      </section>

    </>
  );
}
