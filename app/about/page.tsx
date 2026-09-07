import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Who we are and how we think about hiring.",
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

const NUMBERS = [
  { value: "2019", label: "Founded" },
  { value: "40", label: "People" },
  { value: "5", label: "Cities" },
  { value: "1,200+", label: "Roles filled" },
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
          HireDesk brings job posting, applications and candidate tracking into one place. A
          recruiter posts a role, a candidate finds it and applies, and both sides can see exactly
          where the application stands.
        </p>
      </header>

      <dl className="mt-12 grid grid-cols-2 divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4 sm:divide-x">
        {NUMBERS.map((item) => (
          <div key={item.label} className="px-4 py-5 text-center">
            <dd className="text-2xl font-semibold tracking-tight text-indigo-600">{item.value}</dd>
            <dt className="mt-1 text-sm text-slate-600">{item.label}</dt>
          </div>
        ))}
      </dl>

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
        <h2 className="text-xl font-semibold text-slate-900">How we started</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600">
          <p>
            HireDesk began in 2019 as a spreadsheet. Two of us were hiring for a small studio and
            kept losing track of who had applied, who had been called, and who was still waiting to
            hear back. The spreadsheet grew tabs. Then it grew colour codes. Then it broke.
          </p>
          <p>
            We built the first version of HireDesk for ourselves over a few weekends. The rule we
            set then still holds: if a screen cannot tell you what happens next, it is not
            finished. Today the same product is used by teams hiring their fifth employee and
            teams hiring their five hundredth.
          </p>
        </div>
      </section>
    </div>
  );
}
