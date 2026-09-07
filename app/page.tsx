import Link from "next/link";
import Button from "@/components/Button";
import HiringCta from "@/components/HiringCta";
import JobList from "@/components/JobList";
import { COMPANIES, SEED_JOBS } from "@/lib/jobs";

/**
 * The home page is a Server Component. It reads the seed job data directly at
 * render time, so no JavaScript is needed to show the featured roles.
 */
export default function HomePage() {
  const openJobs = SEED_JOBS.filter((job) => job.status === "Open");

  // Four most recently posted roles.
  const featuredJobs = [...openJobs]
    .sort((a, b) => b.postedDate.localeCompare(a.postedDate))
    .slice(0, 4);

  const totalOpenings = openJobs.reduce((total, job) => total + job.openings, 0);

  const stats = [
    { label: "Open roles", value: openJobs.length },
    { label: "Positions to fill", value: totalOpenings },
    { label: "Hiring companies", value: COMPANIES.length },
    { label: "Cities", value: new Set(openJobs.map((job) => job.location)).size },
  ];


  const steps = [
    {
      title: "Create your profile",
      body: "Add your experience, skills and a resume so recruiters know who they are talking to.",
    },
    {
      title: "Find and apply",
      body: "Search, filter and sort open roles, then apply with a short form and a cover note.",
    },
    {
      title: "Track your progress",
      body: "Follow each application from Applied through to Interview and Hired in one place.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
              {openJobs.length} roles open right now
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Hiring, without the spreadsheet
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              HireDesk brings job posting, applications and candidate tracking together. Candidates
              apply in a couple of minutes; recruiters see everything in one dashboard.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/jobs" size="lg">
                Browse jobs
              </Button>
              <HiringCta />
            </div>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="order-2 mt-1 text-sm text-slate-600">{stat.label}</dt>
                <dd className="order-1 text-3xl font-semibold tracking-tight text-indigo-600">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured jobs */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Latest openings</h2>
            <p className="mt-1 text-sm text-slate-600">Fresh roles added in the last two weeks.</p>
          </div>
          <Link
            href="/jobs"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            See all jobs &rarr;
          </Link>
        </div>

        <JobList jobs={featuredJobs} />
      </section>


      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-200 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 px-8 py-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Ready to make your next move?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Create a profile, save the roles you like and keep every application in one place.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg">
              Create an account
            </Button>
            <Button href="/jobs" variant="outline" size="lg">
              Explore roles
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
