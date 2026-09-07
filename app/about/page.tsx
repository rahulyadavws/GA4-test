import type { Metadata } from "next";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description: "What HireDesk is, and how this demo was built.",
};

const VALUES = [
  {
    title: "Clear over clever",
    body: "Hiring is stressful enough. Every screen should say plainly what is happening and what comes next.",
  },
  {
    title: "Candidates are people",
    body: "Every application gets a status, a date and a reason. No silence, no black holes.",
  },
  {
    title: "One place for everything",
    body: "Jobs, applications and candidates live together, so nothing gets lost in an inbox.",
  },
];

const STACK = [
  { name: "Next.js (App Router)", detail: "File-based routing, layouts and Server Components." },
  { name: "TypeScript", detail: "Interfaces for jobs, applications and candidates." },
  { name: "Tailwind CSS", detail: "All styling, no separate CSS files." },
  { name: "React hooks", detail: "useState, useEffect and a few small custom hooks." },
  { name: "localStorage", detail: "Keeps saved jobs, applications and profile edits between visits." },
  { name: "No backend", detail: "Every record you see comes from a TypeScript file." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm font-semibold text-indigo-600">About HireDesk</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          A hiring tool small teams can actually use
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          HireDesk is a demo hiring management system. It covers the whole loop: a recruiter posts a
          role, a candidate finds it, applies, and both sides can see exactly where the application
          stands.
        </p>
      </header>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-slate-900">What we care about</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-semibold text-slate-900">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-slate-900">How this demo is built</h2>
        <p className="mt-2 text-sm text-slate-600">
          This is a frontend learning project. There is no server, no database and no real login.
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {STACK.map((item) => (
            <div key={item.name} className="rounded-xl border border-slate-200 bg-white p-5">
              <dt className="text-sm font-semibold text-slate-900">{item.name}</dt>
              <dd className="mt-1 text-sm text-slate-600">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 rounded-2xl bg-slate-900 px-8 py-12 text-center">
        <h2 className="text-2xl font-semibold text-white">Have a look around</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-300">
          Browse the job board as a candidate, or open the recruiter dashboard and post a role of
          your own.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/jobs" size="lg">
            Browse jobs
          </Button>
          <Button href="/login" variant="outline" size="lg">
            Log in as a recruiter
          </Button>
        </div>
      </section>
    </div>
  );
}
