"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { useSession } from "@/lib/hooks";
import type { Role } from "@/lib/types";

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const BLANK: FormValues = { fullName: "", email: "", password: "", confirmPassword: "" };

function validate(values: FormValues, agreed: boolean) {
  const errors: Partial<Record<keyof FormValues | "terms", string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "That name looks too short.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Please choose a password.";
  } else if (values.password.length < 8) {
    errors.password = "Use at least 8 characters.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!agreed) errors.terms = "Please accept the terms to continue.";

  return errors;
}

export default function SignupPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [values, setValues] = useState<FormValues>(BLANK);
  const [role, setRole] = useState<Role>("candidate");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues | "terms", string>>>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values, agreed);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    signIn({ name: values.fullName.trim(), email: values.email.trim(), role });
    router.push(role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          It takes less than a minute, and nothing here is real.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">I want to</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  role === "candidate"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Find a job
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                  role === "recruiter"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Hire people
              </button>
            </div>
          </div>

          <FormInput
            label="Full name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="Aarav Sharma"
            required
          />
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
            hint="At least 8 characters."
            required
          />
          <FormInput
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => {
                  setAgreed(event.target.checked);
                  setErrors((current) => ({ ...current, terms: undefined }));
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>I agree to the (imaginary) terms of service and privacy policy.</span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.terms}</p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg">
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
          Log in
        </Link>
      </p>
    </div>
  );
}
