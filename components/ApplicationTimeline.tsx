import ApplicationStatus from "./ApplicationStatus";
import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/lib/types";

/** A vertical history of everything that happened to an application. */
export default function ApplicationTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 border-l border-slate-200 pl-6">
      {events.map((event, index) => (
        <li key={`${event.status}-${event.date}-${index}`} className="relative">
          <span
            className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${
              index === events.length - 1 ? "bg-indigo-600" : "bg-slate-300"
            }`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <ApplicationStatus status={event.status} size="sm" />
            <span className="text-xs text-slate-500">{formatDate(event.date)}</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-700">{event.note}</p>
        </li>
      ))}
    </ol>
  );
}
