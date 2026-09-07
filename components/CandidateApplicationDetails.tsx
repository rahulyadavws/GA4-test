"use client";

import Link from "next/link";
import ApplicationStatus from "./ApplicationStatus";
import ApplicationTimeline from "./ApplicationTimeline";
import Button from "./Button";
import { formatDate } from "@/lib/format";
import { useApplications } from "@/lib/hooks";

/** A label/value pair in the "Application summary" box. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value || "-"}</dd>
    </div>
  );
}

export default function CandidateApplicationDetails({ id }: { id: string }) {
  const { getApplication, loaded } = useApplications();
  const application = getApplication(id);

  if (!application && !loaded) {
    return <p className="py-16 text-center text-slate-500">Loading…</p>;
  }

  if (!application) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Application not found</h1>
        <p className="mt-2 text-slate-600">It may have been removed, or the link is wrong.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/candidate/applications">Back to my applications</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/candidate/applications" className="hover:text-indigo-600">
          My applications
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{application.jobTitle}</span>
      </nav>

      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {application.jobTitle}
            </h1>
            <p className="mt-1 text-slate-600">{application.company}</p>
            <p className="mt-1 text-sm text-slate-500">
              Applied on {formatDate(application.appliedDate)}
            </p>
          </div>
          <ApplicationStatus status={application.status} />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={`/jobs/${application.jobId}`} variant="outline" size="sm">
            View job posting
          </Button>
          <Button href="/candidate/applications" variant="ghost" size="sm">
            Back to list
          </Button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Progress</h2>
            <p className="mt-1 text-sm text-slate-600">
              Recruiters update this as your application moves along.
            </p>
            <div className="mt-5">
              <ApplicationTimeline events={application.timeline} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Your cover letter</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {application.coverLetter}
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">What you submitted</h2>
            <dl className="mt-3 divide-y divide-slate-100">
              <DetailRow label="Name" value={application.candidateName} />
              <DetailRow label="Email" value={application.candidateEmail} />
              <DetailRow label="Phone" value={application.phone} />
              <DetailRow label="Location" value={application.location} />
              <DetailRow label="Experience" value={application.experience} />
              <DetailRow label="Current company" value={application.currentCompany} />
              <DetailRow label="Expected salary" value={application.expectedSalary} />
              <DetailRow label="Notice period" value={application.noticePeriod} />
              <DetailRow label="Resume" value={application.resumeFileName} />
            </dl>

            {(application.portfolioUrl || application.linkedinUrl) && (
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                {application.portfolioUrl && (
                  <p className="truncate text-sm text-indigo-600">{application.portfolioUrl}</p>
                )}
                {application.linkedinUrl && (
                  <p className="truncate text-sm text-indigo-600">{application.linkedinUrl}</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
