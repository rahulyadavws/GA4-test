# HireDesk - Hiring Management Frontend

A small hiring site built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**.
No backend: every job and application comes from a plain TypeScript file, and anything you change
is kept in the browser's `localStorage`.

Built as a base for learning **GA4 / GTM** - see [Analytics](#analytics-ga4--gtm) below.

## How to run

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` / `npm start` for a production build, `npm run lint` for ESLint.
Nothing to configure - no `.env`, no database, no API.

## The two sides of the site

**Job seekers - no account, ever.** They see four public pages and can apply straight away:

| Page | Route |
| --- | --- |
| Home | `/` |
| Jobs | `/jobs` |
| Job details | `/jobs/[id]` |
| Apply | `/jobs/[id]/apply` |
| About | `/about` |
| Contact | `/contact` |

**Recruiters log in** at `/login` (any email and password - nothing is checked) and get:

| Page | Route |
| --- | --- |
| Dashboard | `/recruiter/dashboard` |
| Manage jobs | `/recruiter/jobs` |
| Post a job | `/recruiter/jobs/new` |
| Edit a job | `/recruiter/jobs/[id]/edit` |
| Applications | `/recruiter/applications` |
| Application review | `/recruiter/applications/[id]` |

Everything under `/recruiter` shows a "log in to start hiring" panel until you sign in.

Once a recruiter is signed in the header swaps: **About** and **Contact** disappear (they are there
for job seekers), and **Public job board** stays so a recruiter can check that a role they posted is
really live.

> That gate is **UI only, not security** - there is no server and no real authentication. See
> `components/RequireRole.tsx`.

There is **no form validation anywhere**. Every form submits, even completely empty, which keeps
the flows quick to exercise over and over.

## Folder structure

```
frontend-hrms/
├── app/
│   ├── layout.tsx              # Navbar + page + Footer, and the GA4 snippet
│   ├── page.tsx                # Home (Server Component)
│   ├── not-found.tsx
│   ├── globals.css
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx          # recruiter login
│   ├── jobs/
│   │   ├── page.tsx            # job board, reads ?q= from the home search
│   │   └── [id]/
│   │       ├── page.tsx        # job details
│   │       └── apply/page.tsx  # application form
│   └── recruiter/
│       ├── layout.tsx          # sidebar + login gate
│       ├── dashboard/page.tsx
│       ├── jobs/
│       │   ├── page.tsx        # manage jobs
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       └── applications/
│           ├── page.tsx
│           └── [id]/page.tsx
│
├── components/                 # reusable UI
└── lib/                        # types, dummy data, helpers, hooks
```

Several folders also hold a one-line `layout.tsx` whose only job is to set the page title -
Client Components cannot export `metadata` themselves.

## Important files

| File | What it does |
| --- | --- |
| `lib/types.ts` | `Job`, `Application`, `ApplicationStatus`, `Session` |
| `lib/jobs.ts` | `SEED_JOBS` - 30 sample jobs, plus the option lists used by filters and forms |
| `lib/applications.ts` | `SEED_APPLICATIONS` - 9 sample applications |
| `lib/storage.ts` | the `localStorage` layer and the `useLocalStorageState` hook |
| `lib/hooks.ts` | `useJobs`, `useApplications`, `useSession` |
| `lib/format.ts` | `formatDate`, `timeAgo`, `formatSalary`, `createId` |

## Major components

**Layout** - `Navbar` (public links, plus recruiter links once signed in), `Footer`,
`SidebarNav` (recruiter side), `RequireRole` (the login gate).

**Building blocks** - `Button`, `FormInput` / `FormTextarea` / `FormSelect`, `Badge`,
`ApplicationStatus` (a colour per stage), `PageHeader`, `EmptyState`, `DashboardCard`.

**Jobs** - `JobCard`, `JobList`, `SearchBar`, `FilterPanel`, `HeroSearch` (home page),
`JobBrowser` (holds the search text, filters and sort order for the job board),
`JobDetails`, `ApplyJob`, `EditJob`, `JobForm` (shared by post and edit).

**Applications** - `ApplicationForm`, `ApplicationCard`, `ApplicationTimeline`,
`RecruiterApplicationDetails`.

## Main pages

- **Home** - hero with a search box, live counts, the four newest roles, department shortcuts and a
  short "how it works". It reads the **live** job list, so a role a recruiter posts appears here
  immediately - in the counts, in "Latest openings", in the company strip and in the department
  totals.
- **Jobs** - a Server Component shell around `<JobBrowser />`. Search, filter by location, job
  type, work mode, experience level and minimum salary, and sort five ways. Picks up `?q=` from
  the home page search.
- **Job details** - description, requirements, benefits, skills, and an Apply button.
- **Apply** - the application form. No login, no validation.
- **About / Contact** - static content and a contact form.
- **Recruiter dashboard** - counts, pipeline by stage, latest applications, applications per role.
- **Manage jobs** - a table (cards on mobile) with edit and delete, filtered by status.
- **Post / Edit a job** - both use `JobForm`.
- **Applications** - every application, filterable by status and job, sortable.
- **Application review** - the candidate's details, plus buttons to move them to a new stage with
  an optional note that is written to the timeline.

## How the dummy data works

1. **Seed data** lives in `lib/jobs.ts` and `lib/applications.ts` as ordinary exported arrays.
   That is what you see the first time you open the site.

2. **Changes go to `localStorage`.** `lib/storage.ts` exposes `useLocalStorageState(key, seed)`,
   which behaves like `useState` but starts from the seed (so the server-rendered HTML matches the
   browser exactly), reads the saved value once the page is running, and writes back on change.
   It keeps **one shared value per key**, so every component reading the same data re-renders
   together.

3. **Hooks wrap it** so pages never touch `localStorage` themselves:

   | Hook | Key | Gives you |
   | --- | --- | --- |
   | `useJobs()` | `hrms.jobs` | `jobs`, `openJobs`, `getJob`, `createJob`, `updateJob`, `deleteJob` |
   | `useApplications()` | `hrms.applications` | `applications`, `myApplications`, `addApplication`, `updateStatus`, `hasApplied` |
   | `useSession()` | `hrms.session` | `session`, `signIn`, `signOut` |

4. **Changing the seed data resets saved copies.** `localStorage` always wins over the seed, so
   `lib/storage.ts` keeps a `DATA_VERSION` - bump it whenever you edit the files in `lib/` and
   stale copies are dropped on the next visit.

5. **Resumes are not uploaded.** The file input only records the chosen file's name.

6. **Reset demo data** in the recruiter sidebar puts the original samples back. It leaves you
   signed in.

## Server vs Client Components

Pages are Server Components by default; `"use client"` is added only where the browser is needed:

- **Server:** the root layout, About, Contact's title layout, the recruiter layout, and the dynamic
  route files, which `await params` (and `searchParams` on `/jobs`) and hand the id to a client
  component.
- **Client:** anything that reads the live job list or holds state - Home, `JobBrowser`, every form,
  the dashboard, the navbar.

## Analytics (GA4 / GTM)

The GA4 gtag.js snippet lives in `app/layout.tsx`, so it loads on every page. Nothing else in this
repo touches analytics - no GTM container, no `dataLayer` pushes of our own, no wrapper library.

**It is a single-page app after the first load.** App Router navigations are client-side, so the
browser only does one real page load. GA4 still records later screens because Enhanced
Measurement's *"Page changes based on browser history events"* is on by default - check it under
**Admin &rarr; Data streams &rarr; your stream &rarr; Enhanced measurement** if page views look
like they are missing.

**Every page has its own `<title>`**, so *Pages and screens* is readable. Job pages are titled
after the role ("Senior Frontend Engineer at Nimbus Labs").

**Journeys worth building funnels from:**

| Journey | Route path |
| --- | --- |
| Search &rarr; view a job &rarr; start applying &rarr; submit | `/` or `/jobs` &rarr; `/jobs/[id]` &rarr; `/jobs/[id]/apply` &rarr; success panel |
| Recruiter posts a role | `/login` &rarr; `/recruiter/dashboard` &rarr; `/recruiter/jobs/new` &rarr; `/recruiter/jobs` |
| Recruiter moves a candidate along | `/recruiter/applications` &rarr; `/recruiter/applications/[id]` &rarr; status button |

**Interactions with no URL change** - these need click or custom events rather than page views:

- Submitting the application form (the confirmation is an inline panel, not a new page). If you
  would rather track it as a page view, redirect to a `/jobs/[id]/apply/success` route instead.
- Search, filter and sort on `/jobs`
- Changing an application's status
- Contact form submit, and the recruiter login submit

**Testing tip:** the sample data already has an application against five of the thirty jobs, so
those job pages show "You have already applied". Use **Reset demo data** in the recruiter sidebar
to get the full apply funnel back.

## Not included

No backend, no API calls, no real authentication, no form validation, no Redux. Everything runs in
the browser from local data. The only third-party code is the GA4 snippet in `app/layout.tsx`.
