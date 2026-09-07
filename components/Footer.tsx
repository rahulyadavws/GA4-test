import Link from "next/link";

const COLUMNS = [
  {
    title: "For candidates",
    links: [
      { href: "/jobs", label: "Browse jobs" },
      { href: "/candidate/dashboard", label: "Candidate dashboard" },
      { href: "/candidate/applications", label: "My applications" },
      { href: "/candidate/saved-jobs", label: "Saved jobs" },
    ],
  },
  {
    title: "For recruiters",
    links: [
      { href: "/recruiter/dashboard", label: "Recruiter dashboard" },
      { href: "/recruiter/jobs", label: "Manage jobs" },
      { href: "/recruiter/jobs/new", label: "Post a job" },
      { href: "/recruiter/candidates", label: "Candidates" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                HD
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">HireDesk</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-600">
              A hiring management demo built with Next.js, TypeScript and Tailwind CSS. All data is
              local and made up.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-slate-900">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-indigo-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} HireDesk. A learning project - not a real job board.
          </p>
          <p className="text-xs text-slate-500">Built with Next.js App Router &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
