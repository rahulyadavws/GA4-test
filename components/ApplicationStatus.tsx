import type { ApplicationStatus as Status } from "@/lib/types";

/** Each stage gets its own colour so a list of applications is easy to scan. */
const STATUS_STYLES: Record<Status, string> = {
  Applied: "bg-slate-100 text-slate-700 ring-slate-200",
  "Under Review": "bg-blue-50 text-blue-700 ring-blue-200",
  Shortlisted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Interview: "bg-amber-50 text-amber-800 ring-amber-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
  Hired: "bg-green-50 text-green-700 ring-green-200",
};

/** The coloured dot in front of the label. */
const DOT_STYLES: Record<Status, string> = {
  Applied: "bg-slate-400",
  "Under Review": "bg-blue-500",
  Shortlisted: "bg-indigo-500",
  Interview: "bg-amber-500",
  Rejected: "bg-red-500",
  Hired: "bg-green-500",
};

export default function ApplicationStatus({
  status,
  size = "md",
}: {
  status: Status;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${padding} ${STATUS_STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`} />
      {status}
    </span>
  );
}
