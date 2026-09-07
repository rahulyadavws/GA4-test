import type { ChangeEvent, ReactNode } from "react";

const FIELD_CLASSES =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

/** Shared label wrapper, so every field looks the same. */
function Field({
  label,
  name,
  hint,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}

/** A labelled text input. There is no validation anywhere in this demo. */
export default function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: FormInputProps) {
  return (
    <Field label={label} name={name} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={FIELD_CLASSES}
      />
    </Field>
  );
}

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: FormTextareaProps) {
  return (
    <Field label={label} name={name} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={FIELD_CLASSES}
      />
    </Field>
  );
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[];
  hint?: string;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  hint,
}: FormSelectProps) {
  return (
    <Field label={label} name={name} hint={hint}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={FIELD_CLASSES}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}
