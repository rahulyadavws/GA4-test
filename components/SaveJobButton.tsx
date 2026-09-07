"use client";

import { useRouter } from "next/navigation";
import { useSavedJobs, useSession } from "@/lib/hooks";

/**
 * Bookmark toggle.
 *
 * Saved jobs belong to an account (they show up on the candidate's Saved Jobs
 * page), so signing in is required - otherwise there would be nobody to save
 * them for. Clicking while signed out sends you to the login page.
 */
export default function SaveJobButton({
  jobId,
  withLabel = false,
}: {
  jobId: string;
  withLabel?: boolean;
}) {
  const router = useRouter();
  const { session } = useSession();
  const { isSaved, toggleSaved } = useSavedJobs();

  const canSave = session?.role === "candidate";
  const saved = canSave && isSaved(jobId);

  function handleClick() {
    if (!canSave) {
      router.push("/login");
      return;
    }
    toggleSaved(jobId);
  }

  const title = !session
    ? "Log in to save this job"
    : session.role === "recruiter"
      ? "Only candidates can save jobs"
      : saved
        ? "Remove from saved jobs"
        : "Save this job";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      title={title}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
        saved
          ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
      {withLabel && (saved ? "Saved" : session ? "Save job" : "Log in to save")}
    </button>
  );
}
