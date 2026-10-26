import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  leadingElement?: ReactNode;
  trailingElement?: ReactNode;
  labelAdornment?: ReactNode;
  className?: string;
  error?: string;
};

function Input({
  label,
  leadingElement,
  trailingElement,
  labelAdornment,
  className = "",
  id,
  required = false,
  error,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label
          className="text-label-md text-on-surface"
          htmlFor={inputId}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-secondary">
              *
            </span>
          )}
        </label>
        {labelAdornment}
      </div>

      <div
        className={`flex min-h-11 items-center gap-2 rounded-lg bg-surface-lowest px-3 py-2 shadow-elevation-1 focus-within:ring-2 ${error ? "ring-2 ring-error/60 focus-within:ring-error/60" : "focus-within:ring-primary/50"}`}
      >
        {leadingElement && (
          <span
            aria-hidden="true"
            className="flex shrink-0 items-center text-on-surface-variant"
          >
            {leadingElement}
          </span>
        )}
        <input
          className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          id={inputId}
          required={required}
          {...inputProps}
        />
        {trailingElement}
      </div>
      {error && (
        <p className="mt-1 text-body-sm text-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
