import Link from "next/link";
import ApplicationStatus from "./ApplicationStatus";
import { formatDate } from "@/lib/format";
import type { Application } from "@/lib/types";

/**
 * One row in a list of applications.
 * `basePath` decides where "View" goes - candidates and recruiters have
 * their own detail pages.
 */
export default function ApplicationCard({
  application,
  basePath,
  showCandidate = false,
}: {
  application: Application;
  basePath: string;
  showCandidate?: boolean;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Link
          href={`${basePath}/${application.id}`}
          className="text-base font-semibold text-slate-900 hover:text-indigo-600"
        >
          {application.jobTitle}
        </Link>
        <p className="mt-0.5 text-sm text-slate-600">{application.company}</p>

        {showCandidate && (
          <p className="mt-2 text-sm text-slate-700">
            <span className="font-medium">{application.candidateName}</span>
            <span className="text-slate-400"> &middot; </span>
            <span className="text-slate-600">{application.experience}</span>
            <span className="text-slate-400"> &middot; </span>
            <span className="text-slate-600">{application.location}</span>
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Applied {formatDate(application.appliedDate)} &middot; Resume:{" "}
          {application.resumeFileName}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ApplicationStatus status={application.status} />
        <Link
          href={`${basePath}/${application.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View &rarr;
        </Link>
      </div>
    </article>
  );
}
