import type { Job } from "./types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * "2026-08-28" -> "28 Aug 2026".
 * Built by hand (instead of toLocaleDateString) so the server and the browser
 * always produce exactly the same string.
 */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * "2026-09-04" -> "3 days ago".
 * Only use this inside Client Components - it depends on the current time.
 */
export function timeAgo(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;

  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

/** "12 - 18 LPA" with a rupee sign in front. */
export function formatSalary(job: Pick<Job, "salaryMin" | "salaryMax">): string {
  return `₹${job.salaryMin} - ${job.salaryMax} LPA`;
}

/** Today as an ISO date string, e.g. "2026-09-07". */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Makes a readable id like "app-1757260000000". */
export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
