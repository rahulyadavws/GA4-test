"use client";

import { clearDemoData } from "@/lib/storage";

/**
 * Clears everything this demo saved in localStorage and reloads, which brings
 * back the original seed jobs and applications.
 */
export default function ResetDemoData() {
  function handleReset() {
    const confirmed = window.confirm(
      "Reset the demo? Jobs you created, applications you submitted, saved jobs and profile edits will be removed. You will stay signed in.",
    );
    if (!confirmed) return;

    clearDemoData();
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
    >
      Reset demo data
    </button>
  );
}
