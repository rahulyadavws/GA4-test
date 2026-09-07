"use client";

import { useCallback, useMemo } from "react";
import { SEED_APPLICATIONS } from "./applications";
import {
  BLANK_PROFILE,
  DEFAULT_PROFILE,
  DEMO_CANDIDATE_ID,
  userIdForEmail,
} from "./candidates";
import { createId, today } from "./format";
import { SEED_JOBS } from "./jobs";
import { STORAGE_KEYS, useLocalStorageState } from "./storage";
import type {
  Application,
  ApplicationStatus,
  CandidateProfile,
  Job,
  Session,
} from "./types";

/** Defined once so its identity never changes between renders. */
const NO_SAVED_JOBS: string[] = [];

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
  const { session } = useSession();
  const [applications, setApplications, loaded] = useLocalStorageState<Application[]>(
    STORAGE_KEYS.applications,
    SEED_APPLICATIONS,
  );

  /**
   * The signed-in candidate's own applications, newest first.
   * Empty when nobody is signed in - that is the whole point of asking people
   * to log in before they apply.
   */
  const myApplications = useMemo(
    () =>
      session
        ? applications
            .filter((application) => application.candidateId === session.id)
            .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
        : [],
    [applications, session],
  );

  const getApplication = useCallback(
    (id: string) => applications.find((application) => application.id === id),
    [applications],
  );

  /** True when the signed-in candidate has already applied to this job. */
  const hasApplied = useCallback(
    (jobId: string) => {
      if (!session) return false;
      return applications.some(
        (application) => application.jobId === jobId && application.candidateId === session.id,
      );
    },
    [applications, session],
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
 * The signed-in candidate's saved ("bookmarked") jobs, as a list of job ids.
 * The storage key includes the user id, so two people on the same browser do
 * not share a bookmark list.
 */
export function useSavedJobs() {
  const { session } = useSession();
  const [savedJobIds, setSavedJobIds, loaded] = useLocalStorageState<string[]>(
    session ? `${STORAGE_KEYS.savedJobs}.${session.id}` : STORAGE_KEYS.savedJobs,
    NO_SAVED_JOBS,
  );

  const isSaved = useCallback(
    (jobId: string) => savedJobIds.includes(jobId),
    [savedJobIds],
  );

  const toggleSaved = useCallback(
    (jobId: string) =>
      setSavedJobIds((current) =>
        current.includes(jobId)
          ? current.filter((id) => id !== jobId)
          : [jobId, ...current],
      ),
    [setSavedJobIds],
  );

  return { savedJobIds, loaded, isSaved, toggleSaved };
}

/**
 * The editable candidate profile, stored per user.
 *
 * Logging in as the sample candidate shows the filled-in demo profile; any
 * other account starts blank apart from the name and email you signed up with.
 */
export function useProfile() {
  const { session } = useSession();

  const key = session ? `${STORAGE_KEYS.profile}.${session.id}` : STORAGE_KEYS.profile;

  const initialProfile = useMemo<CandidateProfile>(() => {
    if (!session || session.id === DEMO_CANDIDATE_ID) return DEFAULT_PROFILE;
    return { ...BLANK_PROFILE, fullName: session.name, email: session.email };
  }, [session]);

  const [profile, setProfile, loaded] = useLocalStorageState<CandidateProfile>(key, initialProfile);
  return { profile, setProfile, loaded };
}

/**
 * A pretend sign-in. There is no real authentication here - we simply
 * remember a name, an email and a role in localStorage so the navigation
 * can show the right links.
 */
export function useSession() {
  const [session, setSession, loaded] = useLocalStorageState<Session | null>(
    STORAGE_KEYS.session,
    null,
  );

  /** Callers pass a name, email and role; the id is derived from the email. */
  const signIn = useCallback(
    (details: Omit<Session, "id">) =>
      setSession({ ...details, id: userIdForEmail(details.email, details.role) }),
    [setSession],
  );
  const signOut = useCallback(() => setSession(null), [setSession]);

  return { session, loaded, signIn, signOut };
}
