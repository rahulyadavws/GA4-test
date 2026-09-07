"use client";

import { useCallback, useMemo } from "react";
import { DEMO_CANDIDATE_ID, SEED_APPLICATIONS } from "./applications";
import { createId, today } from "./format";
import { SEED_JOBS } from "./jobs";
import { STORAGE_KEYS, useLocalStorageState } from "./storage";
import type { Application, ApplicationStatus, Job, Session } from "./types";

/**
 * The job list, seeded from lib/jobs.ts and then kept in localStorage so
 * recruiter edits survive a page refresh.
 */
export function useJobs() {
  const [jobs, setJobs, loaded] = useLocalStorageState<Job[]>(STORAGE_KEYS.jobs, SEED_JOBS);

  const getJob = useCallback(
    (id: string) => jobs.find((job) => job.id === id),
    [jobs],
  );

  const createJob = useCallback(
    (job: Omit<Job, "id" | "postedDate">) => {
      const newJob: Job = { ...job, id: createId("job"), postedDate: today() };
      setJobs((current) => [newJob, ...current]);
      return newJob;
    },
    [setJobs],
  );

  const updateJob = useCallback(
    (id: string, changes: Partial<Job>) => {
      setJobs((current) =>
        current.map((job) => (job.id === id ? { ...job, ...changes } : job)),
      );
    },
    [setJobs],
  );

  const deleteJob = useCallback(
    (id: string) => setJobs((current) => current.filter((job) => job.id !== id)),
    [setJobs],
  );

  /** Only these are shown to candidates on the public job board. */
  const openJobs = useMemo(() => jobs.filter((job) => job.status === "Open"), [jobs]);

  return { jobs, openJobs, loaded, getJob, createJob, updateJob, deleteJob };
}

/** Every application in the demo, plus the actions that change them. */
export function useApplications() {
  const [applications, setApplications, loaded] = useLocalStorageState<Application[]>(
    STORAGE_KEYS.applications,
    SEED_APPLICATIONS,
  );

  /** The demo candidate's own applications, newest first. */
  const myApplications = useMemo(
    () =>
      applications
        .filter((application) => application.candidateId === DEMO_CANDIDATE_ID)
        .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)),
    [applications],
  );

  const getApplication = useCallback(
    (id: string) => applications.find((application) => application.id === id),
    [applications],
  );

  /** True when the demo candidate has already applied to this job. */
  const hasApplied = useCallback(
    (jobId: string) =>
      applications.some(
        (application) =>
          application.jobId === jobId && application.candidateId === DEMO_CANDIDATE_ID,
      ),
    [applications],
  );

  const addApplication = useCallback(
    (application: Omit<Application, "id" | "status" | "appliedDate" | "timeline">) => {
      const date = today();
      const newApplication: Application = {
        ...application,
        id: createId("app"),
        status: "Applied",
        appliedDate: date,
        timeline: [{ status: "Applied", date, note: "Application submitted." }],
      };
      setApplications((current) => [newApplication, ...current]);
      return newApplication;
    },
    [setApplications],
  );

  /** Recruiter action: move an application to a new stage and log it. */
  const updateStatus = useCallback(
    (id: string, status: ApplicationStatus, note?: string) => {
      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? {
                ...application,
                status,
                timeline: [
                  ...application.timeline,
                  {
                    status,
                    date: today(),
                    note: note?.trim() || `Status changed to ${status}.`,
                  },
                ],
              }
            : application,
        ),
      );
    },
    [setApplications],
  );

  /** How many applications sit in each status - used by the dashboards. */
  const countByStatus = useCallback(
    (list: Application[]) =>
      list.reduce<Record<string, number>>((counts, application) => {
        counts[application.status] = (counts[application.status] ?? 0) + 1;
        return counts;
      }, {}),
    [],
  );

  return {
    applications,
    myApplications,
    loaded,
    getApplication,
    hasApplied,
    addApplication,
    updateStatus,
    countByStatus,
  };
}

/**
 * A pretend sign-in, used by the recruiter side only.
 *
 * Candidates never log in on this site - they browse and apply straight away.
 * Recruiters sign in so the recruiter dashboard has an obvious entry point.
 * There is no real authentication: we just remember a name, an email and a
 * role in localStorage.
 */
export function useSession() {
  const [session, setSession, loaded] = useLocalStorageState<Session | null>(
    STORAGE_KEYS.session,
    null,
  );

  const signIn = useCallback((next: Session) => setSession(next), [setSession]);
  const signOut = useCallback(() => setSession(null), [setSession]);

  return { session, loaded, signIn, signOut };
}
