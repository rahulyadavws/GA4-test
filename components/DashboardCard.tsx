import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "indigo" | "green" | "amber" | "blue" | "slate" | "red";

const TONES: Record<Tone, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-600",
  red: "bg-red-50 text-red-600",
};

/** A single statistic on a dashboard, e.g. "12 Active jobs". */
export default function DashboardCard({
  label,
  value,
  hint,
  icon,
  tone = "indigo",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: Tone;
  href?: string;
}) {
  const card = (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${TONES[tone]}`}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}
