"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/lib/hooks";

/** Turns "neha.kapoor@hiredesk.com" into "Neha Kapoor". */
function nameFromEmail(email: string) {
  return (
    email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || "Recruiter"
  );
}

/**
 * Recruiter login.
 *
 * Candidates never sign in on this site - they browse and apply straight away -
 * so this page only exists for the hiring side. Nothing is validated and
 * nothing is checked against a server.
 */
export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const [values, setValues] = useState({ email: "", password: "" });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn({ name: nameFromEmail(values.email), email: values.email.trim(), role: "recruiter" });
    router.push("/recruiter/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
          For recruiters
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">
          Log in to post roles and review applications.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Work email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@company.com"
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            placeholder="Your password"
          />
          <Button type="submit" fullWidth size="lg">
            Log in
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={() => setValues({ email: "neha.kapoor@hiredesk.com", password: "demo1234" })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Fill the demo recruiter login
          </button>
          <p className="mt-3 text-xs text-slate-500">
            This is a frontend demo. Any email and password will work - nothing is checked, and
            nothing is validated.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Looking for a job?{" "}
        <Link href="/jobs" className="font-medium text-indigo-600 hover:text-indigo-700">
          Browse open roles
        </Link>{" "}
        - no account needed.
      </p>
    </div>
  );
}
