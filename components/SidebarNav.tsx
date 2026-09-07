"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ResetDemoData from "./ResetDemoData";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

/**
 * The dashboard sidebar. The active link is the one whose href is the longest
 * prefix of the current path, so /recruiter/jobs/new highlights "Post a job"
 * rather than "Manage jobs".
 */
export default function SidebarNav({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();

  const activeHref = items
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                item.href === activeHref
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 hidden rounded-lg border border-slate-200 bg-white p-4 lg:block">
        <p className="text-xs font-semibold text-slate-900">Demo data</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          Your changes are saved in this browser only. Reset to go back to the original sample data.
        </p>
        <div className="mt-3">
          <ResetDemoData />
        </div>
      </div>
    </nav>
  );
}
