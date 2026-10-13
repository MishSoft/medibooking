import { useId, type SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
};

function Select({
  label,
  options,
  placeholder,
  className = "",
  id,
  ...selectProps
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-label-md text-on-surface"
        htmlFor={selectId}
      >
        {label}
      </label>
      <div className="relative flex min-h-11 items-center rounded-lg bg-surface-lowest shadow-elevation-1 focus-within:ring-2 focus-within:ring-primary/50">
        <select
          className="min-h-11 w-full cursor-pointer appearance-none bg-transparent py-2 pr-9 pl-3 text-body-md text-on-surface outline-none disabled:cursor-not-allowed disabled:opacity-60"
          id={selectId}
          {...selectProps}
        >
          {placeholder !== undefined && (
            <option className="bg-surface-container" value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              className="bg-surface-container"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 h-4 w-4 text-on-surface-variant"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export default Select;
