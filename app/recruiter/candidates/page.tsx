"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ApplicationStatus from "@/components/ApplicationStatus";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { CANDIDATES } from "@/lib/candidates";
import type { Candidate } from "@/lib/types";
import { useApplications } from "@/lib/hooks";

export default function CandidatesPage() {
  const { applications } = useApplications();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  /**
   * The seeded talent pool, plus anyone who has applied with an account of
   * their own. Without this, a brand new candidate would send an application
   * the recruiter could see but never appear in this list.
   */
  const allCandidates = useMemo(() => {
    const extra: Candidate[] = [];
    const seen = new Set(CANDIDATES.map((candidate) => candidate.id));

    applications.forEach((application) => {
      if (seen.has(application.candidateId)) return;
      seen.add(application.candidateId);
      extra.push({
        id: application.candidateId,
        name: application.candidateName,
        email: application.candidateEmail,
        phone: application.phone,
        headline: "Applied through HireDesk",
        location: application.location,
        experience: application.experience,
        skills: [],
        currentCompany: application.currentCompany,
      });
    });

    return [...CANDIDATES, ...extra];
  }, [applications]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return allCandidates;

    return allCandidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(needle) ||
        candidate.headline.toLowerCase().includes(needle) ||
        candidate.location.toLowerCase().includes(needle) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(needle)),
    );
  }, [search, allCandidates]);

  return (
    <>
      <PageHeader
        title="Candidates"
        description="Everyone who has applied through HireDesk. Click a card to see their applications."
      />

      <div className="mb-5">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search candidates by name, title, location or skill"
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No candidates match"
          description="Try a shorter search term."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {visible.map((candidate) => {
            // Applications belonging to this person, newest first.
            const theirApplications = applications
              .filter((application) => application.candidateId === candidate.id)
              .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate));

            const expanded = openId === candidate.id;

            return (
              <article
                key={candidate.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                    {candidate.name.slice(0, 1)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-slate-900">
                      {candidate.name}
                    </h2>
                    <p className="text-sm text-slate-600">{candidate.headline}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {candidate.location} &middot; {candidate.experience} &middot;{" "}
                      {candidate.currentCompany}
                    </p>
                  </div>

                  <Badge tone="indigo">
                    {theirApplications.length}{" "}
                    {theirApplications.length === 1 ? "application" : "applications"}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <a
                    href={`mailto:${candidate.email}`}
                    className="truncate text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {candidate.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpenId(expanded ? null : candidate.id)}
                    className="shrink-0 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    {expanded ? "Hide applications" : "Show applications"}
                  </button>
                </div>

                {expanded && (
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {theirApplications.length === 0 ? (
                      <li className="text-sm text-slate-600">
                        No applications from this candidate yet.
                      </li>
                    ) : (
                      theirApplications.map((application) => (
                        <li
                          key={application.id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                        >
                          <Link
                            href={`/recruiter/applications/${application.id}`}
                            className="truncate text-sm font-medium text-slate-800 hover:text-indigo-600"
                          >
                            {application.jobTitle}
                          </Link>
                          <ApplicationStatus status={application.status} size="sm" />
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
