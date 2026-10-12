import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  leadingElement?: ReactNode;
  trailingElement?: ReactNode;
  labelAdornment?: ReactNode;
  className?: string;
};

function Input({
  label,
  leadingElement,
  trailingElement,
  labelAdornment,
  className = "",
  id,
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label
          className="text-label-md text-on-surface"
          htmlFor={inputId}
        >
          {label}
        </label>
        {labelAdornment}
      </div>

      <div className="flex min-h-11 items-center gap-2 rounded-lg bg-surface-lowest px-3 py-2 shadow-elevation-1 focus-within:ring-2 focus-within:ring-primary/50">
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
          id={inputId}
          {...inputProps}
        />
        {trailingElement}
      </div>
    </div>
  );
}

export default Input;
