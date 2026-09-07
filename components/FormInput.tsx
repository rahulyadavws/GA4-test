import type { ChangeEvent, ReactNode } from "react";

const FIELD_CLASSES =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2";

/** Red border when the field has an error, grey otherwise. */
function fieldClasses(hasError: boolean) {
  return `${FIELD_CLASSES} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
  }`;
}

/** Shared label + error wrapper, so every field looks the same. */
function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
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
  error?: string;
  hint?: string;
  required?: boolean;
}

/** A labelled text input with an error message underneath. */
export default function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  hint,
  required,
}: FormInputProps) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClasses(Boolean(error))}
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
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
  hint,
  required,
}: FormTextareaProps) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={fieldClasses(Boolean(error))}
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
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  hint,
  required,
}: FormSelectProps) {
  return (
    <Field label={label} name={name} error={error} hint={hint} required={required}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={fieldClasses(Boolean(error))}
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
