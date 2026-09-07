"use client";

import Link from "next/link";
import { useState } from "react";
import ApplicationStatus from "./ApplicationStatus";
import ApplicationTimeline from "./ApplicationTimeline";
import Button from "./Button";
import { FormTextarea } from "./FormInput";
import { formatDate } from "@/lib/format";
import { useApplications } from "@/lib/hooks";
import { APPLICATION_STATUSES, type ApplicationStatus as Status } from "@/lib/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">{value || "-"}</dd>
    </div>
  );
}

export default function RecruiterApplicationDetails({ id }: { id: string }) {
  const { getApplication, updateStatus, loaded } = useApplications();
  const application = getApplication(id);

  const [note, setNote] = useState("");
  const [justUpdated, setJustUpdated] = useState<Status | null>(null);

  if (!application && !loaded) {
    return <p className="py-16 text-center text-slate-500">Loading…</p>;
  }

  if (!application) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Application not found</h1>
        <div className="mt-6 flex justify-center">
          <Button href="/recruiter/applications">Back to applications</Button>
        </div>
      </div>
    );
  }

  /** Move the application to a new stage and record the optional note. */
  function handleStatusChange(next: Status) {
    if (next === application?.status) return;
    updateStatus(id, next, note);
    setNote("");
    setJustUpdated(next);
  }

  return (
    <>
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/recruiter/applications" className="hover:text-indigo-600">
          Applications
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{application.candidateName}</span>
      </nav>

      <header className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
              {application.candidateName.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {application.candidateName}
              </h1>
              <p className="mt-0.5 text-slate-600">
                Applied for{" "}
                <Link
                  href={`/jobs/${application.jobId}`}
                  className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {application.jobTitle}
                </Link>{" "}
                on {formatDate(application.appliedDate)}
              </p>
            </div>
          </div>
          <ApplicationStatus status={application.status} />
        </div>
      </header>

      {justUpdated && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 ring-1 ring-inset ring-green-200">
          <p className="text-sm font-medium text-green-900">
            Status updated to {justUpdated}. The candidate can see this on their applications page.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Status control */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Move this application</h2>
            <p className="mt-1 text-sm text-slate-600">
              Pick the new stage. Add a note first if you want it saved to the timeline.
            </p>

            <div className="mt-4">
              <FormTextarea
                label="Note (optional)"
                name="note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                placeholder="Technical interview scheduled for 12 Sep, 3:00 PM."
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {APPLICATION_STATUSES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleStatusChange(option)}
                  disabled={option === application.status}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                    option === application.status
                      ? "cursor-not-allowed border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Cover letter</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {application.coverLetter}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">History</h2>
            <div className="mt-5">
              <ApplicationTimeline events={application.timeline} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Candidate details</h2>
            <dl className="mt-3 divide-y divide-slate-100">
              <DetailRow label="Email" value={application.candidateEmail} />
              <DetailRow label="Phone" value={application.phone} />
              <DetailRow label="Location" value={application.location} />
              <DetailRow label="Experience" value={application.experience} />
              <DetailRow label="Current company" value={application.currentCompany} />
              <DetailRow label="Expected salary" value={application.expectedSalary} />
              <DetailRow label="Notice period" value={application.noticePeriod} />
            </dl>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Resume</p>
              <p className="mt-1 text-sm text-slate-800">{application.resumeFileName}</p>
              <p className="mt-1 text-xs text-slate-500">
                Demo only - no file was actually uploaded.
              </p>
            </div>

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
