import type { ReactNode } from "react";

/** Shown wherever a list has nothing in it yet. */
export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">{description}</p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
