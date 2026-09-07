"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Button from "./Button";
import { useSession } from "@/lib/hooks";
import type { Role } from "@/lib/types";

/**
 * Hides a whole dashboard area behind the demo login.
 *
 * Anyone can browse jobs without an account, but the candidate and recruiter
 * dashboards only open once you are signed in with the matching role.
 *
 * Note this is a *UI* gate, not security. There is no server and no real
 * authentication in this project - it only decides what the screen shows.
 */
export default function RequireRole({
  role,
  children,
  title,
  body,
}: {
  role: Role;
  children: ReactNode;
  /** Optional wording, for gates that are not a dashboard (e.g. applying). */
  title?: string;
  body?: string;
}) {
  const { session, loaded, signOut } = useSession();

  // The session lives in localStorage, so on the very first render we do not
  // know yet whether anybody is signed in. Wait rather than guess wrong.
  if (!loaded) {
    return <Panel title="Checking your session…" />;
  }

  // Not signed in at all.
  if (!session) {
    return (
      <Panel
        icon="🔒"
        title={
          title ??
          (role === "recruiter" ? "Log in to start hiring" : "Log in to see your dashboard")
        }
        body={
          body ??
          (role === "recruiter"
            ? "Recruiter tools - posting jobs, reviewing applications and moving candidates through the pipeline - need a recruiter account."
            : "Your dashboard, applications, saved jobs and profile are tied to your account. Log in to pick up where you left off.")
        }
        actions={
          <>
            <Button href="/login">Log in</Button>
            <Button href="/signup" variant="outline">
              Create an account
            </Button>
          </>
        }
        footer={
          role === "candidate" ? (
            <>
              You can still{" "}
              <Link href="/jobs" className="font-medium text-indigo-600 hover:text-indigo-700">
                browse every open role
              </Link>{" "}
              without an account.
            </>
          ) : (
            <>
              Looking for a job instead?{" "}
              <Link href="/jobs" className="font-medium text-indigo-600 hover:text-indigo-700">
                Browse open roles
              </Link>
              .
            </>
          )
        }
      />
    );
  }

  // Signed in, but as the other kind of user.
  if (session.role !== role) {
    const theirDashboard =
      session.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard";

    return (
      <Panel
        icon="🚧"
        title={`This area is for ${role}s`}
        body={`You are signed in as ${session.name} (${session.role}). Switch account to continue, or head back to your own dashboard.`}
        actions={
          <>
            <Button href={theirDashboard}>Go to my dashboard</Button>
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </>
        }
      />
    );
  }

  return <>{children}</>;
}

/** The centred card shown instead of the dashboard. */
function Panel({
  icon,
  title,
  body,
  actions,
  footer,
}: {
  icon?: string;
  title: string;
  body?: string;
  actions?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      {icon && (
        <span className="text-4xl" aria-hidden>
          {icon}
        </span>
      )}
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {body && <p className="mt-3 text-slate-600">{body}</p>}
      {actions && <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{actions}</div>}
      {footer && <p className="mt-6 text-sm text-slate-500">{footer}</p>}
    </div>
  );
}
