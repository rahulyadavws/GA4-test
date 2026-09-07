/**
 * All the main data shapes used across the app.
 * Everything here is plain TypeScript - no backend, no database.
 */

/** The kind of contract a job offers. */
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

/** Where the work happens. */
export type WorkMode = "On-site" | "Hybrid" | "Remote";

/** Rough seniority bucket, used by the filter panel. */
export type ExperienceLevel = "Entry" | "Mid" | "Senior" | "Lead";

/** Whether a job is visible to candidates. Recruiters control this. */
export type JobStatus = "Open" | "Closed" | "Draft";

/** The six stages an application can be in. */
export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Hired";

/** The order statuses are shown in, e.g. in dropdowns and dashboards. */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
];

export interface Job {
  id: string;
  title: string;
  company: string;
  /** Two letters shown in the little coloured square on a job card. */
  companyInitials: string;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  /** Human readable, e.g. "3 - 5 years". */
  experience: string;
  experienceLevel: ExperienceLevel;
  /** Salary in lakhs per annum (LPA). */
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  department: string;
  openings: number;
  /** ISO date, e.g. "2026-08-28". */
  postedDate: string;
  status: JobStatus;
}

/** One entry in an application's history, shown as a vertical timeline. */
export interface TimelineEvent {
  status: ApplicationStatus;
  date: string;
  note: string;
}

export interface Application {
  id: string;
  jobId: string;
  /** Copied from the job so the card can render without a lookup. */
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  phone: string;
  location: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  coverLetter: string;
  /** Only the file name is kept - the demo never uploads anything. */
  resumeFileName: string;
  portfolioUrl: string;
  linkedinUrl: string;
  status: ApplicationStatus;
  appliedDate: string;
  timeline: TimelineEvent[];
}

export type Role = "candidate" | "recruiter";

/** A pretend logged-in recruiter. Stored in localStorage, no real auth. */
export interface Session {
  name: string;
  email: string;
  role: Role;
}
