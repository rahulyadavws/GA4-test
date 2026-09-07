"use client";

import { useMemo, useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/PageHeader";
import SearchBar from "@/components/SearchBar";
import { useApplications } from "@/lib/hooks";
import { APPLICATION_STATUSES } from "@/lib/types";

const ALL = "All";

export default function MyApplicationsPage() {
  const { myApplications, countByStatus } = useApplications();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);

  const counts = countByStatus(myApplications);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return myApplications.filter((application) => {
      const matchesStatus = status === ALL || application.status === status;
      const matchesSearch =
        !needle ||
        application.jobTitle.toLowerCase().includes(needle) ||
        application.company.toLowerCase().includes(needle);
      return matchesStatus && matchesSearch;
    });
  }, [myApplications, search, status]);

  const tabs = [ALL, ...APPLICATION_STATUSES];

  return (
    <>
      <PageHeader
        title="My applications"
        description="Every role you have applied for, and where each one stands."
        action={<Button href="/jobs">Apply for more</Button>}
      />

      <div className="mb-5 space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search your applications by job title or company"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const count = tab === ALL ? myApplications.length : (counts[tab] ?? 0);
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatus(tab)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  status === tab
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
                <span className="ml-1.5 text-xs text-slate-400">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={myApplications.length === 0 ? "No applications yet" : "Nothing matches that"}
          description={
            myApplications.length === 0
              ? "Once you apply for a role it will show up here with its status."
              : "Try a different search term or pick another status tab."
          }
          action={myApplications.length === 0 ? <Button href="/jobs">Browse jobs</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              basePath="/candidate/applications"
            />
          ))}
        </div>
      )}
    </>
  );
}
