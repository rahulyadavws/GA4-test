"use client";

import { useState } from "react";
import Button from "@/components/Button";
import FormInput, { FormSelect, FormTextarea } from "@/components/FormInput";

const SUBJECTS = [
  "General enquiry",
  "Support with an application",
  "Posting a job",
  "Partnership",
  "Something else",
];

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const BLANK: FormValues = {
  name: "",
  email: "",
  subject: SUBJECTS[0],
  message: "",
};

const CONTACT_DETAILS = [
  { label: "Email", value: "hello@hiredesk.example" },
  { label: "Phone", value: "+91 80 4000 1234" },
  { label: "Office", value: "4th floor, Ashwin House, Indiranagar, Bengaluru 560038" },
  { label: "Hours", value: "Monday to Friday, 9:30 AM - 6:30 PM IST" },
];

export default function ContactPage() {
  const [values, setValues] = useState<FormValues>(BLANK);
  const [sent, setSent] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Nothing is sent anywhere - we just show the confirmation.
    setSent(true);
    setValues(BLANK);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Get in touch</h1>
        <p className="mt-3 text-slate-600">
          Questions about a role, a problem with an application, or interested in posting jobs? Send
          us a note and we will get back to you within two working days.
        </p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          {sent && (
            <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 ring-1 ring-inset ring-green-200">
              <p className="text-sm font-semibold text-green-900">Thanks - your message was sent.</p>
              <p className="mt-0.5 text-sm text-green-800">
                This is a demo, so nothing actually left your browser.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput
                label="Your name"
                name="name"
                value={values.name}
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
            </div>

            <FormSelect
              label="Subject"
              name="subject"
              value={values.subject}
              onChange={handleChange}
              options={SUBJECTS}
            />

            <FormTextarea
              label="Message"
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={6}
              placeholder="How can we help?"
            />

            <Button type="submit" size="lg">
              Send message
            </Button>
          </form>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Contact details</h2>
            <dl className="mt-4 space-y-4">
              {CONTACT_DETAILS.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {detail.label}
                  </dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
            <h2 className="text-base font-semibold text-indigo-900">Looking for a job?</h2>
            <p className="mt-1 text-sm text-indigo-800">
              You do not need to email us to apply - just find the role and hit apply.
            </p>
            <div className="mt-4">
              <Button href="/jobs" size="sm">
                Browse jobs
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
