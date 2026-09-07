"use client";

import { useState } from "react";
import Button from "./Button";
import FormInput, { FormSelect, FormTextarea } from "./FormInput";
import { DEPARTMENTS, EXPERIENCE_LEVELS, JOB_TYPES, WORK_MODES } from "@/lib/jobs";
import type { ExperienceLevel, Job, JobStatus, JobType, WorkMode } from "@/lib/types";

const JOB_STATUSES: JobStatus[] = ["Open", "Draft", "Closed"];

/** Everything the form holds. Numbers are kept as strings while editing. */
interface JobFormValues {
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  jobType: string;
  workMode: string;
  experience: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  openings: string;
  department: string;
  status: string;
  skills: string;
  description: string;
  requirements: string;
  benefits: string;
}

/** What the parent page receives when the form is valid. */
export type JobFormResult = Omit<Job, "id" | "postedDate">;

const BLANK: JobFormValues = {
  title: "",
  company: "",
  companyInitials: "",
  location: "",
  jobType: "Full-time",
  workMode: "On-site",
  experience: "",
  experienceLevel: "Mid",
  salaryMin: "",
  salaryMax: "",
  openings: "1",
  department: "Engineering",
  status: "Open",
  skills: "",
  description: "",
  requirements: "",
  benefits: "",
};

/** "React, TypeScript" -> ["React", "TypeScript"] */
function splitByComma(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

/** One item per line. */
function splitByLine(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

/** Turns an existing job back into form values. */
function jobToValues(job: Job): JobFormValues {
  return {
    title: job.title,
    company: job.company,
    companyInitials: job.companyInitials,
    location: job.location,
    jobType: job.jobType,
    workMode: job.workMode,
    experience: job.experience,
    experienceLevel: job.experienceLevel,
    salaryMin: String(job.salaryMin),
    salaryMax: String(job.salaryMax),
    openings: String(job.openings),
    department: job.department,
    status: job.status,
    skills: job.skills.join(", "),
    description: job.description,
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
  };
}

function validate(values: JobFormValues) {
  const errors: Partial<Record<keyof JobFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = "Please enter a job title.";
  } else if (values.title.trim().length < 4) {
    errors.title = "That title looks too short.";
  }

  if (!values.company.trim()) errors.company = "Please enter the company name.";
  if (!values.location.trim()) errors.location = "Please enter a location.";
  if (!values.experience.trim()) errors.experience = "For example: 3 - 5 years.";

  const min = Number(values.salaryMin);
  const max = Number(values.salaryMax);

  if (!values.salaryMin.trim()) {
    errors.salaryMin = "Enter a minimum salary.";
  } else if (Number.isNaN(min) || min <= 0) {
    errors.salaryMin = "Enter a number greater than 0.";
  }

  if (!values.salaryMax.trim()) {
    errors.salaryMax = "Enter a maximum salary.";
  } else if (Number.isNaN(max) || max <= 0) {
    errors.salaryMax = "Enter a number greater than 0.";
  } else if (!Number.isNaN(min) && max < min) {
    errors.salaryMax = "Maximum must be at least the minimum.";
  }

  const openings = Number(values.openings);
  if (Number.isNaN(openings) || openings < 1) errors.openings = "There must be at least 1 opening.";

  if (splitByComma(values.skills).length === 0) {
    errors.skills = "Add at least one skill.";
  }

  if (!values.description.trim()) {
    errors.description = "Please describe the role.";
  } else if (values.description.trim().length < 60) {
    errors.description = "Please write at least 60 characters.";
  }

  if (splitByLine(values.requirements).length === 0) {
    errors.requirements = "Add at least one requirement, one per line.";
  }

  return errors;
}

export default function JobForm({
  job,
  onSave,
  submitLabel,
  cancelHref,
}: {
  /** Pass an existing job to edit it; leave it out to create a new one. */
  job?: Job;
  onSave: (result: JobFormResult) => void;
  submitLabel: string;
  cancelHref: string;
}) {
  const [values, setValues] = useState<JobFormValues>(job ? jobToValues(job) : BLANK);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({});

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const company = values.company.trim();

    onSave({
      title: values.title.trim(),
      company,
      // Fall back to the first two letters of the company name.
      companyInitials: (values.companyInitials.trim() || company.slice(0, 2)).toUpperCase(),
      location: values.location.trim(),
      jobType: values.jobType as JobType,
      workMode: values.workMode as WorkMode,
      experience: values.experience.trim(),
      experienceLevel: values.experienceLevel as ExperienceLevel,
      salaryMin: Number(values.salaryMin),
      salaryMax: Number(values.salaryMax),
      skills: splitByComma(values.skills),
      description: values.description.trim(),
      requirements: splitByLine(values.requirements),
      benefits: splitByLine(values.benefits),
      department: values.department,
      openings: Number(values.openings),
      status: values.status as JobStatus,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">The basics</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            label="Job title"
            name="title"
            value={values.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Senior Frontend Engineer"
            required
          />
          <FormInput
            label="Company"
            name="company"
            value={values.company}
            onChange={handleChange}
            error={errors.company}
            placeholder="Nimbus Labs"
            required
          />
          <FormInput
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            error={errors.location}
            placeholder="Bengaluru, India"
            required
          />
          <FormInput
            label="Company initials"
            name="companyInitials"
            value={values.companyInitials}
            onChange={handleChange}
            placeholder="NL"
            hint="Shown on the job card. Left blank, we use the first two letters."
          />
          <FormSelect
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange}
            options={DEPARTMENTS}
          />
          <FormSelect
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={JOB_STATUSES}
            hint="Only Open jobs appear on the public job board."
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">Type, level and pay</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormSelect
            label="Job type"
            name="jobType"
            value={values.jobType}
            onChange={handleChange}
            options={JOB_TYPES}
          />
          <FormSelect
            label="Work mode"
            name="workMode"
            value={values.workMode}
            onChange={handleChange}
            options={WORK_MODES}
          />
          <FormInput
            label="Experience required"
            name="experience"
            value={values.experience}
            onChange={handleChange}
            error={errors.experience}
            placeholder="3 - 5 years"
            required
          />
          <FormSelect
            label="Experience level"
            name="experienceLevel"
            value={values.experienceLevel}
            onChange={handleChange}
            options={EXPERIENCE_LEVELS}
          />
          <FormInput
            label="Minimum salary (LPA)"
            name="salaryMin"
            type="number"
            value={values.salaryMin}
            onChange={handleChange}
            error={errors.salaryMin}
            placeholder="18"
            required
          />
          <FormInput
            label="Maximum salary (LPA)"
            name="salaryMax"
            type="number"
            value={values.salaryMax}
            onChange={handleChange}
            error={errors.salaryMax}
            placeholder="28"
            required
          />
          <FormInput
            label="Number of openings"
            name="openings"
            type="number"
            value={values.openings}
            onChange={handleChange}
            error={errors.openings}
            required
          />
          <FormInput
            label="Skills"
            name="skills"
            value={values.skills}
            onChange={handleChange}
            error={errors.skills}
            placeholder="React, TypeScript, Next.js"
            hint="Separate each skill with a comma."
            required
          />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-slate-900">The detail</legend>
        <div className="space-y-5">
          <FormTextarea
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={errors.description}
            rows={5}
            placeholder="What the role is, who the team is, and why it matters."
            hint={`${values.description.trim().length} / 60 characters minimum`}
            required
          />
          <FormTextarea
            label="Requirements"
            name="requirements"
            value={values.requirements}
            onChange={handleChange}
            error={errors.requirements}
            rows={5}
            placeholder={"4+ years with React\nStrong TypeScript"}
            hint="One per line."
            required
          />
          <FormTextarea
            label="Benefits"
            name="benefits"
            value={values.benefits}
            onChange={handleChange}
            rows={4}
            placeholder={"Health insurance\nLearning budget"}
            hint="One per line."
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button href={cancelHref} variant="outline">
          Cancel
        </Button>
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
