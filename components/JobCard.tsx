import Link from "next/link";
import Badge from "./Badge";
import SaveJobButton from "./SaveJobButton";
import { formatDate, formatSalary } from "@/lib/format";
import type { Job } from "@/lib/types";

/** A small coloured square with the company initials, instead of a logo image. */
const INITIAL_COLOURS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
];

function colourFor(text: string) {
  // Same company always gets the same colour.
  const sum = text.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return INITIAL_COLOURS[sum % INITIAL_COLOURS.length];
}

export default function JobCard({ job, showSave = true }: { job: Job; showSave?: boolean }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${colourFor(job.company)}`}
        >
          {job.companyInitials}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            <Link href={`/jobs/${job.id}`} className="hover:text-indigo-600">
              {job.title}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-slate-600">
            {job.company} &middot; {job.location}
          </p>
        </div>

        {showSave && <SaveJobButton jobId={job.id} />}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="indigo">{job.jobType}</Badge>
        <Badge tone="blue">{job.workMode}</Badge>
        <Badge tone="slate">{job.experience}</Badge>
        <Badge tone="green">{formatSalary(job)}</Badge>
      </div>

      <p className="line-clamp-2 text-sm text-slate-600">{job.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="px-1 py-1 text-xs text-slate-500">+{job.skills.length - 4} more</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">Posted {formatDate(job.postedDate)}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View details &rarr;
        </Link>
      </div>
    </article>
  );
}
