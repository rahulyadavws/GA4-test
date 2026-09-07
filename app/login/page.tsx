"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/lib/hooks";
import type { Role } from "@/lib/types";

/** Turns "aarav.sharma@example.com" into "Aarav Sharma". */
function nameFromEmail(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [values, setValues] = useState({ email: "", password: "" });
  const [role, setRole] = useState<Role>("candidate");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.password) {
      nextErrors.password = "Please enter your password.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // No real authentication - we just remember who you said you are.
    signIn({ name: nameFromEmail(values.email), email: values.email.trim(), role });
    router.push(role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
  }

  /** Fills the form with one of the two demo logins. */
  function fillDemoAccount(demoRole: Role) {
    setRole(demoRole);
    setValues({
      email: demoRole === "recruiter" ? "neha.kapoor@hiredesk.com" : "aarav.sharma@example.com",
      password: "demo1234",
    });
    setErrors({});
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Log in to manage your jobs and applications.</p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">I am a</span>
            <div className="grid grid-cols-2 gap-2">
              {(["candidate", "recruiter"] as Role[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition ${
                    role === option
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="you@example.com"
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="At least 6 characters"
            required
          />

          <Button type="submit" fullWidth size="lg">
            Log in
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-xs font-medium text-slate-500">Try a demo account</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("candidate")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Fill candidate login
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("recruiter")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Fill recruiter login
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            This is a frontend demo. Any email and password will work - nothing is checked against
            a server.
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
