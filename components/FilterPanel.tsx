"use client";

import { EXPERIENCE_LEVELS, JOB_TYPES, WORK_MODES } from "@/lib/jobs";

/** Everything the user can narrow the job list down by. */
export interface JobFilters {
  jobTypes: string[];
  workModes: string[];
  experienceLevels: string[];
  location: string;
  minSalary: number;
}

export const ALL_LOCATIONS = "All locations";

export const EMPTY_FILTERS: JobFilters = {
  jobTypes: [],
  workModes: [],
  experienceLevels: [],
  location: ALL_LOCATIONS,
  minSalary: 0,
};

/** True when nothing is filtered, used to show/hide the "Clear all" button. */
export function hasActiveFilters(filters: JobFilters) {
  return (
    filters.jobTypes.length > 0 ||
    filters.workModes.length > 0 ||
    filters.experienceLevels.length > 0 ||
    filters.location !== ALL_LOCATIONS ||
    filters.minSalary > 0
  );
}

/** Adds a value to a list, or removes it if it is already there. */
function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function CheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-900">{title}</legend>
      <div className="space-y-1.5">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FilterPanel({
  filters,
  onChange,
  locations,
}: {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  locations: string[];
}) {
  const active = hasActiveFilters(filters);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        {active && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-900">
            Location
          </label>
          <select
            id="location"
            value={filters.location}
            onChange={(event) => onChange({ ...filters, location: event.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value={ALL_LOCATIONS}>{ALL_LOCATIONS}</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <CheckboxGroup
          title="Job type"
          options={JOB_TYPES}
          selected={filters.jobTypes}
          onToggle={(value) => onChange({ ...filters, jobTypes: toggle(filters.jobTypes, value) })}
        />

        <CheckboxGroup
          title="Work mode"
          options={WORK_MODES}
          selected={filters.workModes}
          onToggle={(value) => onChange({ ...filters, workModes: toggle(filters.workModes, value) })}
        />

        <CheckboxGroup
          title="Experience level"
          options={EXPERIENCE_LEVELS}
          selected={filters.experienceLevels}
          onToggle={(value) =>
            onChange({ ...filters, experienceLevels: toggle(filters.experienceLevels, value) })
          }
        />

        <div>
          <label htmlFor="minSalary" className="mb-2 block text-sm font-semibold text-slate-900">
            Minimum salary
            <span className="ml-1 font-normal text-slate-500">
              {filters.minSalary === 0 ? "(any)" : `₹${filters.minSalary} LPA+`}
            </span>
          </label>
          <input
            id="minSalary"
            type="range"
            min={0}
            max={50}
            step={5}
            value={filters.minSalary}
            onChange={(event) => onChange({ ...filters, minSalary: Number(event.target.value) })}
            className="w-full accent-indigo-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>Any</span>
            <span>₹50 LPA</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
