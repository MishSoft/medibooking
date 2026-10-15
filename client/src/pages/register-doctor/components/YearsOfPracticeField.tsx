import { useId } from "react";

type YearsOfPracticeFieldProps = {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  error?: string;
};

function YearsOfPracticeField({
  value,
  onChange,
  onBlur,
  error,
}: YearsOfPracticeFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const numericYears = Number.isFinite(value) ? value : 0;

  function adjustYears(amount: number) {
    onChange(Math.max(0, numericYears + amount));
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="text-label-md text-on-surface" htmlFor={inputId}>
          Years of Clinical Practice
          <span aria-hidden="true" className="ml-1 text-secondary">
            *
          </span>
        </label>
        <span className="text-body-sm text-primary">
          {numericYears} Years Accredited
        </span>
      </div>

      <div
        className={`flex min-h-11 items-center gap-1 rounded-lg bg-surface-lowest p-1 shadow-elevation-1 focus-within:ring-2 ${error ? "ring-2 ring-error/60 focus-within:ring-error/60" : "focus-within:ring-primary/50"}`}
      >
        <button
          aria-label="Decrease years of clinical practice"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface-container-high text-headline-sm text-on-surface transition-colors hover:bg-surface-highest disabled:cursor-not-allowed disabled:opacity-50"
          disabled={numericYears <= 0}
          onClick={() => adjustYears(-1)}
          type="button"
        >
          −
        </button>
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className="min-w-0 flex-1 bg-transparent text-center text-body-md text-on-surface outline-none"
          id={inputId}
          min="0"
          onBlur={onBlur}
          onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
          type="number"
          value={Number.isFinite(value) ? value : ""}
        />
        <button
          aria-label="Increase years of clinical practice"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface-container-high text-headline-sm text-on-surface transition-colors hover:bg-surface-highest"
          onClick={() => adjustYears(1)}
          type="button"
        >
          +
        </button>
      </div>
      {error && (
        <p className="mt-1 text-body-sm text-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default YearsOfPracticeField;
