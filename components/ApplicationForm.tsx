"use client";

import { useState } from "react";
import Button from "./Button";
import FormInput, { FormSelect, FormTextarea } from "./FormInput";
import { useApplications, useProfile, useSession } from "@/lib/hooks";
import type { CandidateProfile, Job } from "@/lib/types";

const NOTICE_PERIODS = ["Immediate", "15 days", "30 days", "60 days", "90 days"];

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  portfolioUrl: string;
  linkedinUrl: string;
  coverLetter: string;
  resumeFileName: string;
}

/** The values the form starts with, taken from the saved profile. */
function defaultsFrom(profile: CandidateProfile): FormValues {
  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    experience: profile.experience,
    currentCompany: profile.currentCompany,
    expectedSalary: profile.expectedSalary,
    noticePeriod: profile.noticePeriod || "30 days",
    portfolioUrl: profile.portfolioUrl,
    linkedinUrl: profile.linkedinUrl,
    coverLetter: "",
    resumeFileName: profile.resumeFileName,
  };
}

/** Plain client-side validation. Returns one message per invalid field. */
function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "That name looks too short.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address, e.g. you@example.com.";
  }

  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Please enter a phone number.";
  } else if (digits.length < 10) {
    errors.phone = "Phone number needs at least 10 digits.";
  }

  if (!values.location.trim()) errors.location = "Please enter your current location.";
  if (!values.experience.trim()) errors.experience = "Please enter your years of experience.";
  if (!values.expectedSalary.trim()) errors.expectedSalary = "Please enter your expected salary.";

  if (!values.coverLetter.trim()) {
    errors.coverLetter = "A short cover letter is required.";
  } else if (values.coverLetter.trim().length < 40) {
    errors.coverLetter = "Please write at least 40 characters.";
  }

  if (!values.resumeFileName) errors.resumeFileName = "Please select your resume file.";

  return errors;
}

export default function ApplicationForm({ job }: { job: Job }) {
  const { profile } = useProfile();
  const { addApplication, hasApplied } = useApplications();
  const { session } = useSession();

  // Only what the user has actually typed is stored. Anything they have not
  // touched falls back to their profile, so the form is pre-filled for free.
  const [edits, setEdits] = useState<Partial<FormValues>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  // Holds the new application id once the form has been submitted.
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const values: FormValues = { ...defaultsFrom(profile), ...edits };

  /** One change handler for every text field, keyed by the input's name. */
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setEdits((current) => ({ ...current, [name]: value }));
    // Clear the error as soon as the user starts fixing the field.
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  /** We never upload anything - we only remember the file name. */
  function handleResumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setEdits((current) => ({ ...current, resumeFileName: file ? file.name : "" }));
    setErrors((current) => ({ ...current, resumeFileName: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // The apply route is behind a candidate login, so this should never happen -
    // it is here so TypeScript knows the id below is safe.
    if (!session) return;

    const application = addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      // This is what links the application to the person who submitted it.
      candidateId: session.id,
      candidateName: values.fullName,
      candidateEmail: values.email,
      phone: values.phone,
      location: values.location,
      experience: values.experience,
      currentCompany: values.currentCompany,
      expectedSalary: values.expectedSalary,
      noticePeriod: values.noticePeriod,
      coverLetter: values.coverLetter,
      resumeFileName: values.resumeFileName,
      portfolioUrl: values.portfolioUrl,
      linkedinUrl: values.linkedinUrl,
    });

    setSubmittedId(application.id);
    window.scrollTo({ top: 0 });
  }

  if (submittedId) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <h2 className="mt-3 text-xl font-semibold text-green-900">Application submitted</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-green-800">
          Your application for <span className="font-medium">{job.title}</span> at {job.company} is
          in. You can follow its progress from your applications page.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={`/candidate/applications/${submittedId}`}>View application</Button>
          <Button href="/jobs" variant="outline">
            Browse more jobs
          </Button>
        </div>
      </div>
    );
  }

  if (hasApplied(job.id)) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-base font-semibold text-green-900">
          You have already applied for this role
        </h2>
        <p className="mt-1 text-sm text-green-800">
          You can follow its progress from your applications page.
        </p>
        <div className="mt-4 flex gap-3">
          <Button href="/candidate/applications">View my applications</Button>
          <Button href="/jobs" variant="outline">
            Browse other jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
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
            label="Phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+91 98200 41122"
            required
          />
          <FormInput
            label="Current location"
            name="location"
            value={values.location}
            onChange={handleChange}
            error={errors.location}
            placeholder="Bengaluru, India"
            required
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">
          Experience and expectations
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            label="Years of experience"
            name="experience"
            value={values.experience}
            onChange={handleChange}
            error={errors.experience}
            placeholder="4 years"
            required
          />
          <FormInput
            label="Current company"
            name="currentCompany"
            value={values.currentCompany}
            onChange={handleChange}
            placeholder="Bluepeak Software"
            hint="Leave blank if you are not working right now."
          />
          <FormInput
            label="Expected salary"
            name="expectedSalary"
            value={values.expectedSalary}
            onChange={handleChange}
            error={errors.expectedSalary}
            placeholder="28 LPA"
            required
          />
          <FormSelect
            label="Notice period"
            name="noticePeriod"
            value={values.noticePeriod}
            onChange={handleChange}
            options={NOTICE_PERIODS}
          />
          <FormInput
            label="Portfolio / GitHub"
            name="portfolioUrl"
            value={values.portfolioUrl}
            onChange={handleChange}
            placeholder="https://yourname.dev"
          />
          <FormInput
            label="LinkedIn"
            name="linkedinUrl"
            value={values.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">Resume and cover letter</legend>

        <div className="space-y-5">
          <div>
            <label htmlFor="resume" className="mb-1.5 block text-sm font-medium text-slate-700">
              Resume<span className="ml-0.5 text-red-500">*</span>
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
            {values.resumeFileName && !errors.resumeFileName && (
              <p className="mt-1.5 text-xs text-green-700">Selected: {values.resumeFileName}</p>
            )}
            {errors.resumeFileName && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.resumeFileName}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Demo only - the file is not uploaded anywhere. Only the file name is saved.
            </p>
          </div>

          <FormTextarea
            label="Cover letter"
            name="coverLetter"
            value={values.coverLetter}
            onChange={handleChange}
            error={errors.coverLetter}
            rows={6}
            placeholder="Tell the hiring team why this role is a good fit for you…"
            hint={`${values.coverLetter.trim().length} / 40 characters minimum`}
            required
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button href={`/jobs/${job.id}`} variant="outline">
          Cancel
        </Button>
        <Button type="submit" size="lg">
          Submit application
        </Button>
      </div>
    </form>
  );
}
