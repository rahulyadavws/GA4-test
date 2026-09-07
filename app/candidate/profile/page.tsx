"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import FormInput, { FormSelect, FormTextarea } from "@/components/FormInput";
import PageHeader from "@/components/PageHeader";
import { useProfile } from "@/lib/hooks";
import type { CandidateProfile } from "@/lib/types";

const NOTICE_PERIODS = ["Immediate", "15 days", "30 days", "60 days", "90 days"];

/** Client-side validation for the profile form. */
function validate(values: CandidateProfile) {
  const errors: Partial<Record<keyof CandidateProfile, string>> = {};

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

  const digits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Please enter a phone number.";
  } else if (digits.length < 10) {
    errors.phone = "Phone number needs at least 10 digits.";
  }

  if (!values.location.trim()) errors.location = "Please enter your location.";
  if (!values.headline.trim()) errors.headline = "A short headline helps recruiters place you.";
  if (!values.experience.trim()) errors.experience = "Please enter your years of experience.";
  if (!values.skills.trim()) errors.skills = "Add at least one skill.";

  if (values.about.trim() && values.about.trim().length < 30) {
    errors.about = "Either leave this blank or write at least 30 characters.";
  }

  return errors;
}

export default function CandidateProfilePage() {
  const { profile, setProfile } = useProfile();

  // Only the fields the user has edited are held in state; everything else
  // comes straight from the saved profile.
  const [edits, setEdits] = useState<Partial<CandidateProfile>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof CandidateProfile, string>>>({});
  const [saved, setSaved] = useState(false);

  const values: CandidateProfile = { ...profile, ...edits };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setEdits((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSaved(false);
  }

  function handleResumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setEdits((current) => ({ ...current, resumeFileName: file.name }));
    setSaved(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    setProfile(values);
    setEdits({});
    setSaved(true);
  }

  const skillList = values.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        title="My profile"
        description="Kept in this browser and used to pre-fill your job applications."
      />

      {saved && (
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 ring-1 ring-inset ring-green-200">
          <p className="text-sm font-semibold text-green-900">Profile saved</p>
          <p className="mt-0.5 text-sm text-green-800">
            Your next application will use these details automatically.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
            <legend className="px-2 text-sm font-semibold text-slate-900">Basic details</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Full name"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <FormInput
                label="Location"
                name="location"
                value={values.location}
                onChange={handleChange}
                error={errors.location}
                required
              />
            </div>

            <div className="mt-5">
              <FormInput
                label="Headline"
                name="headline"
                value={values.headline}
                onChange={handleChange}
                error={errors.headline}
                placeholder="Frontend Engineer with a soft spot for design systems"
                hint="One line describing what you do."
                required
              />
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
            <legend className="px-2 text-sm font-semibold text-slate-900">Work</legend>
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
            </div>

            <div className="mt-5 space-y-5">
              <FormInput
                label="Skills"
                name="skills"
                value={values.skills}
                onChange={handleChange}
                error={errors.skills}
                placeholder="React, TypeScript, Tailwind CSS"
                hint="Separate each skill with a comma."
                required
              />
              <FormTextarea
                label="About you"
                name="about"
                value={values.about}
                onChange={handleChange}
                error={errors.about}
                rows={5}
                placeholder="A short summary recruiters will read first."
              />
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
            <legend className="px-2 text-sm font-semibold text-slate-900">Links and resume</legend>
            <div className="grid gap-5 sm:grid-cols-2">
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

            <div className="mt-5">
              <label htmlFor="resume" className="mb-1.5 block text-sm font-medium text-slate-700">
                Resume
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-l-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Current file: <span className="font-medium">{values.resumeFileName || "none"}</span>.
                Demo only - nothing is uploaded.
              </p>
            </div>
          </fieldset>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setEdits({})}>
              Undo changes
            </Button>
            <Button type="submit" size="lg">
              Save profile
            </Button>
          </div>
        </form>

        {/* Live preview of how recruiters see the profile */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Preview</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-base font-bold text-indigo-700">
                {values.fullName.slice(0, 1).toUpperCase() || "?"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {values.fullName || "Your name"}
                </p>
                <p className="truncate text-sm text-slate-600">{values.headline || "Your headline"}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Location</dt>
                <dd className="text-right font-medium text-slate-900">{values.location || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Experience</dt>
                <dd className="text-right font-medium text-slate-900">{values.experience || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-600">Notice</dt>
                <dd className="text-right font-medium text-slate-900">{values.noticePeriod}</dd>
              </div>
            </dl>

            {skillList.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                {skillList.map((skill) => (
                  <Badge key={skill} tone="indigo">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
