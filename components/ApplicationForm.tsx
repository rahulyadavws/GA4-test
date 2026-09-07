"use client";

import { useState } from "react";
import Button from "./Button";
import FormInput, { FormSelect, FormTextarea } from "./FormInput";
import { DEMO_CANDIDATE_ID } from "@/lib/applications";
import { useApplications } from "@/lib/hooks";
import type { Job } from "@/lib/types";

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

const BLANK_FORM: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  experience: "",
  currentCompany: "",
  expectedSalary: "",
  noticePeriod: "30 days",
  portfolioUrl: "",
  linkedinUrl: "",
  coverLetter: "",
  resumeFileName: "",
};

export default function ApplicationForm({ job }: { job: Job }) {
  const { addApplication, hasApplied } = useApplications();

  const [edits, setEdits] = useState<Partial<FormValues>>({});
  // Flips once the form has been submitted, swapping in the success panel.
  const [submitted, setSubmitted] = useState(false);

  const values: FormValues = { ...BLANK_FORM, ...edits };

  /** One change handler for every text field, keyed by the input's name. */
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setEdits((current) => ({ ...current, [name]: value }));
  }

  /** We never upload anything - we only remember the file name. */
  function handleResumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setEdits((current) => ({ ...current, resumeFileName: file ? file.name : "" }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      candidateId: DEMO_CANDIDATE_ID,
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

    setSubmitted(true);
    window.scrollTo({ top: 0 });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <h2 className="mt-3 text-xl font-semibold text-green-900">Application submitted</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-green-800">
          Your application for <span className="font-medium">{job.title}</span> at {job.company} is
          in. The hiring team will be in touch by email.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/jobs">Browse more jobs</Button>
          <Button href="/" variant="outline">
            Back to home
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
          The hiring team already has your details.
        </p>
        <div className="mt-4 flex gap-3">
          <Button href="/jobs">Browse other jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            label="Full name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            placeholder="Aarav Sharma"
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+91 98200 41122"
          />
          <FormInput
            label="Current location"
            name="location"
            value={values.location}
            onChange={handleChange}
            placeholder="Bengaluru, India"
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
            placeholder="4 years"
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
            placeholder="28 LPA"
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
              Resume
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            />
            {values.resumeFileName && (
              <p className="mt-1.5 text-xs text-green-700">Selected: {values.resumeFileName}</p>
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
            rows={6}
            placeholder="Tell the hiring team why this role is a good fit for you…"
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
