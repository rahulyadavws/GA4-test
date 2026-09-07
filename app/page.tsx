"use client";

import Link from "next/link";
import Button from "@/components/Button";
import HeroSearch from "@/components/HeroSearch";
import JobList from "@/components/JobList";
import { useJobs } from "@/lib/hooks";

const DEPARTMENT_ICONS: Record<string, string> = {
  Engineering: "💻",
  Design: "🎨",
  Data: "📊",
  Product: "🧭",
  Marketing: "📣",
  Sales: "🤝",
  Finance: "💰",
  "Human Resources": "👥",
};

const STEPS = [
  {
    title: "Search open roles",
    body: "Filter by location, job type, experience and salary until you find something that fits.",
  },
  {
    title: "Apply in minutes",
    body: "One short form and a resume. No account to create, no password to remember.",
  },
  {
    title: "Hear back",
    body: "The hiring team reviews your application and gets in touch by email.",
  },
];

/**
 * The home page reads the live job list, so a role a recruiter posts shows up
 * here straight away - in the counts, in "Latest openings" and in the
 * department shortcuts.
 */
export default function HomePage() {
  const { openJobs } = useJobs();

  const featuredJobs = [...openJobs]
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate))
    .slice(0, 4);

  const companies = Array.from(new Set(openJobs.map((job) => job.company))).sort();
  const totalOpenings = openJobs.reduce((total, job) => total + job.openings, 0);
  const locations = new Set(openJobs.map((job) => job.location)).size;

  const stats = [
    { label: "Open roles", value: openJobs.length },
    { label: "Positions to fill", value: totalOpenings },
    { label: "Hiring companies", value: companies.length },
    { label: "Locations", value: locations },
  ];

  const departments = Array.from(new Set(openJobs.map((job) => job.department)))
    .map((name) => ({ name, count: openJobs.filter((job) => job.department === name).length }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-50 via-white to-white"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {openJobs.length} roles open right now
            </span>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Find the job that fits
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
              Browse {openJobs.length} open roles across {companies.length} companies. Apply in a
              couple of minutes - no account needed.
            </p>

            <HeroSearch />
          </div>

          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4 sm:divide-x">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-5 text-center">
                <dd className="text-3xl font-semibold tracking-tight text-indigo-600">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-sm text-slate-600">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Companies */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">
            Companies hiring on HireDesk
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {companies.map((company) => (
              <span key={company} className="text-sm font-semibold text-slate-400">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Latest openings */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Latest openings</h2>
            <p className="mt-1 text-sm text-slate-600">The most recently posted roles.</p>
          </div>
          <Link href="/jobs" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            See all {openJobs.length} jobs &rarr;
          </Link>
        </div>

        <JobList jobs={featuredJobs} />
      </section>

      {/* Browse by department */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Browse by department
          </h2>
          <p className="mt-1 text-sm text-slate-600">Jump straight to the kind of work you do.</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {departments.map((department) => (
              <Link
                key={department.name}
                href={`/jobs?q=${encodeURIComponent(department.name)}`}
                className="rounded-xl border border-slate-200 p-5 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40"
              >
                <span className="text-2xl">{DEPARTMENT_ICONS[department.name] ?? "💼"}</span>
                <p className="mt-2 text-sm font-medium text-slate-900">{department.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {department.count} {department.count === 1 ? "role" : "roles"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Ready to make your next move?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            {openJobs.length} open roles across {companies.length} companies. Applying takes a
            couple of minutes and needs no account.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/jobs" size="lg">
              Browse all jobs
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
