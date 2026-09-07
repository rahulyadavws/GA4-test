# HireDesk - HRMS / Hiring Management Frontend

A frontend-only hiring management system built with **Next.js (App Router)**, **TypeScript** and
**Tailwind CSS**. There is no backend: every job, application and candidate comes from a plain
TypeScript file, and anything you change is kept in the browser's `localStorage`.

## How to run

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
```

There is nothing to configure - no `.env`, no database, no API.

### Who can see what

| Area | Login needed? |
| --- | --- |
| Home, Jobs, Job details, About, Contact | No - open to everyone |
| **Applying for a job** | Yes, as a **candidate** |
| **Saving a job** (the bookmark icon) | Yes, as a **candidate** |
| `/candidate/*` - dashboard, my applications, saved jobs, profile | Yes, as a **candidate** |
| `/recruiter/*` - dashboard, manage/post/edit jobs, applications, candidates | Yes, as a **recruiter** |

Anyone can browse and read every open role. Anything that has to *belong to someone* - an
application, a bookmark, a profile - needs an account, because otherwise there would be no way to
say whose it is. On a job page a signed-out visitor sees **Log in to apply** instead of **Apply
now**; recruiters are told they cannot apply.

Signing in as the wrong role shows a "this area is for recruiters/candidates" message with a link
to your own dashboard, rather than the page you asked for.

> This is a **UI gate, not security**. There is no server and no real authentication - it only
> decides what the screen shows. `components/RequireRole.tsx` is where it lives.

### How a user is identified

`useSession().signIn()` turns the email you log in with into a stable `id`
(`lib/candidates.ts` &rarr; `userIdForEmail`):

- An email belonging to one of the sample candidates keeps that candidate's seeded id, so
  `aarav.sharma@example.com` logs in as `cand-001` and sees the five sample applications already
  in flight.
- Any other email gets an id of its own (`cand-<email>`) and starts with an empty dashboard and a
  blank profile pre-filled with the name and email you signed up with.

That id is what every application is stamped with, so:

- **My Applications** shows only rows whose `candidateId` matches you.
- **Saved jobs** and **profile** are stored under per-user keys
  (`hrms.savedJobs.<id>`, `hrms.profile.<id>`), so two people using the same browser never see
  each other's data.
- Recruiters see *every* application, and anyone who applies with a new account is added to the
  recruiter's Candidates list automatically.

Log out and back in with a different email to watch the dashboard change.

### Trying it out

- **Candidate with history:** `/login`, pick "candidate", use `aarav.sharma@example.com`.
- **Candidate starting fresh:** same, but any other email - you get an empty dashboard.
- **Recruiter:** `/login`, pick "recruiter".
- The login page has **Fill candidate login** / **Fill recruiter login** buttons.
- The sidebar on either dashboard has a **Reset demo data** button that puts the original sample
  data back. It leaves you signed in.

## Folder structure

```
frontend-hrms/
├── app/                            # App Router - every folder is a URL
│   ├── layout.tsx                  # Root layout: Navbar + page + Footer
│   ├── page.tsx                    # Home (Server Component)
│   ├── not-found.tsx               # 404 page
│   ├── globals.css                 # Tailwind import + a few base styles
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── jobs/
│   │   ├── page.tsx                # Job board
│   │   └── [id]/
│   │       ├── page.tsx            # Job details  (dynamic route)
│   │       └── apply/page.tsx      # Application form
│   ├── candidate/
│   │   ├── layout.tsx              # Candidate sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── saved-jobs/page.tsx
│   │   └── applications/
│   │       ├── page.tsx            # My applications
│   │       └── [id]/page.tsx       # Application details
│   └── recruiter/
│       ├── layout.tsx              # Recruiter sidebar
│       ├── dashboard/page.tsx
│       ├── candidates/page.tsx
│       ├── jobs/
│       │   ├── page.tsx            # Manage jobs
│       │   ├── new/page.tsx        # Create job
│       │   └── [id]/edit/page.tsx  # Edit job
│       └── applications/
│           ├── page.tsx
│           └── [id]/page.tsx       # Details + change status
│
├── components/                     # Reusable UI
└── lib/                            # Types, dummy data, helpers, hooks
```

## Important files

| File | What it does |
| --- | --- |
| `lib/types.ts` | Every interface and union type: `Job`, `Application`, `Candidate`, `ApplicationStatus`, … |
| `lib/jobs.ts` | `SEED_JOBS` - the 8 sample jobs, plus the option lists used by filters and forms |
| `lib/applications.ts` | `SEED_APPLICATIONS` - 9 sample applications |
| `lib/candidates.ts` | `CANDIDATES` (talent pool) and `DEFAULT_PROFILE` (the demo candidate) |
| `lib/storage.ts` | The `localStorage` layer and the `useLocalStorageState` hook |
| `lib/hooks.ts` | `useJobs`, `useApplications`, `useSavedJobs`, `useProfile`, `useSession` |
| `lib/format.ts` | `formatDate`, `timeAgo`, `formatSalary`, `createId` |
| `app/layout.tsx` | Wraps every page in the navbar and footer |

## Major components

**Layout**

- `Navbar` - client component. Highlights the current route, shows candidate or recruiter links
  depending on the demo session, and has a mobile menu. Signing out clears the session and sends
  you back to the home page.
- `Footer` - static link columns.
- `RequireRole` - wraps the two dashboard layouts. Shows a "log in to continue" panel instead of
  the dashboard when you are signed out or signed in as the other role.
- `HiringCta` - the home page's "I'm hiring" button; points at `/login`, or at the recruiter
  dashboard if a recruiter is already signed in.
- `SidebarNav` - the left-hand nav on the two dashboards. Highlights the deepest matching link, so
  `/recruiter/jobs/new` lights up "Post a Job" rather than "Manage Jobs".

**Building blocks**

- `Button` - one button style used everywhere. Pass `href` and it renders a `<Link>` instead.
- `FormInput` (plus `FormTextarea` and `FormSelect`) - a labelled field with an error message
  underneath. Every form is built from these.
- `Badge`, `ApplicationStatus`, `PageHeader`, `EmptyState`, `DashboardCard` - small presentational
  pieces. `ApplicationStatus` maps each of the six stages to its own colour.

**Jobs**

- `JobCard` - one job in a list: company initials, badges, skills, salary, save button.
- `JobList` - a responsive grid of `JobCard`s, or an empty state.
- `SearchBar` - a controlled search input; the parent owns the value.
- `FilterPanel` - location, job type, work mode, experience level and a minimum-salary slider.
- `JobBrowser` - the job board itself. Holds the search text, filters and sort order, and combines
  them into the visible list. This is where search/filter/sort actually happen.
- `JobDetails` / `ApplyJob` / `EditJob` - the client halves of the three dynamic routes.
- `SaveJobButton` - the bookmark toggle.

**Applications**

- `ApplicationForm` - the apply form. Pre-fills from the saved profile, validates on submit, and
  shows a success panel instead of navigating away.
- `ApplicationCard` - one application in a list. `basePath` decides whether "View" goes to the
  candidate or the recruiter detail page.
- `ApplicationTimeline` - the vertical history on a detail page.
- `JobForm` - shared by Create Job and Edit Job.

## Main pages

**Public**

- **Home** - a Server Component. Reads the seed jobs directly and renders the hero, some counts,
  the four newest roles and a short "how it works" section.
- **Jobs** - a Server Component shell around `<JobBrowser />`. Search, filter and sort.
- **Job details** (`/jobs/[id]`) - full description, requirements, benefits, skills, a sidebar with
  the salary and Apply/Save buttons, and two similar roles.
- **Apply** (`/jobs/[id]/apply`) - the application form. Candidate login required; the submitted
  application is stamped with your user id.
- **Login / Signup** - fake sign-in. Any credentials work; you pick candidate or recruiter and that
  choice decides which dashboard you land on.
- **About / Contact** - static content and a validated contact form.

**Candidate**

- **Dashboard** - counts, a pipeline breakdown by status, and the three most recent applications.
- **My Applications** - searchable, with a tab per status.
- **Application details** - the timeline plus everything that was submitted.
- **Saved Jobs** - the roles you bookmarked.
- **Profile** - an editable profile with a live preview. Saved values pre-fill future applications.

**Recruiter**

- **Dashboard** - counts, pipeline by stage, latest applications, applications per role.
- **Manage Jobs** - a table (cards on mobile) with edit and delete, filtered by status.
- **Create / Edit Job** - both use `JobForm`.
- **Applications** - every application, filterable by status and job, sortable.
- **Application details** - the candidate's details plus buttons to move them to a new stage, with
  an optional note that is written to the timeline.
- **Candidates** - the talent pool; expand a card to see that person's applications.

## How the dummy data works

1. **Seed data** lives in `lib/jobs.ts`, `lib/applications.ts` and `lib/candidates.ts` as ordinary
   exported arrays. This is what the app shows the very first time you open it.

2. **Changes go to `localStorage`.** `lib/storage.ts` exposes `useLocalStorageState(key, seed)`,
   which behaves like `useState` but:
   - starts from the seed array, so the HTML rendered on the server matches the browser exactly;
   - reads the saved value once the page is running in the browser;
   - writes back on every change.

   It keeps **one shared value per key**, so if two components read the saved-jobs list they both
   re-render when it changes. (Plain `useState` would give each of them a separate copy, and the
   job card and the list around it would disagree.)

3. **Hooks wrap the raw storage** so pages never touch `localStorage` themselves:

   | Hook | Key | Gives you |
   | --- | --- | --- |
   | `useJobs()` | `hrms.jobs` | `jobs`, `openJobs`, `getJob`, `createJob`, `updateJob`, `deleteJob` |
   | `useApplications()` | `hrms.applications` | `applications`, `myApplications`, `addApplication`, `updateStatus`, `hasApplied` |
   | `useSavedJobs()` | `hrms.savedJobs` | `savedJobIds`, `isSaved`, `toggleSaved` |
   | `useProfile()` | `hrms.profile` | `profile`, `setProfile` |
   | `useSession()` | `hrms.session` | `session`, `signIn`, `signOut` |

4. **Changing the seed data resets saved copies.** `localStorage` always wins over the seed, so
   anyone who used the site before would otherwise be stuck with the old sample data forever.
   `lib/storage.ts` keeps a `DATA_VERSION` - bump it whenever you edit the files in `lib/`, and
   stale saved copies are dropped automatically on the next visit. Your login is not touched.

5. **Resumes are not uploaded.** The file input only records the chosen file's name.

6. **Each account has its own data.** Applications carry a `candidateId`; saved jobs and profiles
   live under per-user keys. See "How a user is identified" above.

7. **There is no real authentication.** `useSession` stores a name, an email and a role. It decides
   which navbar links appear and which dashboards open - but it is all client-side, so treat it as
   a demo of the flow, not as a security boundary.

## Server vs Client Components

Pages are Server Components by default. `"use client"` is added only where the browser is needed -
state, event handlers or `localStorage`:

- **Server:** the root layout, Home, About, the two dashboard layouts, and the four dynamic route
  files, which `await params` and hand the id to a client component.
- **Client:** anything interactive - `JobBrowser`, every form, both dashboards, the navbar.

## Not included

By design there is no backend, no API calls, no real auth, no Redux and no analytics. Everything
runs in the browser from local data.
