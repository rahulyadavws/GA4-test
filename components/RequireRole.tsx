"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Button from "./Button";
import { useSession } from "@/lib/hooks";

/**
 * Hides the recruiter area behind the demo login.
 *
 * Everything a job seeker needs - the home page, the job board, a job page and
 * the application form - is open to everyone. Only the hiring side signs in.
 *
 * This is a *UI* gate, not security. There is no server and no real
 * authentication here; it only decides what the screen shows.
 */
export default function RequireRole({ children }: { children: ReactNode }) {
  const { session, loaded } = useSession();

  // The session lives in localStorage, so on the very first render we do not
  // know yet whether anybody is signed in. Wait rather than guess wrong.
  if (!loaded) return <Panel title="Checking your session…" />;

  if (!session) {
    return (
      <Panel
        icon="🔒"
        title="Log in to start hiring"
        body="Posting jobs and reviewing applications needs a recruiter account."
        actions={<Button href="/login">Recruiter login</Button>}
        footer={
          <>
            Looking for a job instead?{" "}
            <Link href="/jobs" className="font-medium text-indigo-600 hover:text-indigo-700">
              Browse open roles
            </Link>
            .
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
