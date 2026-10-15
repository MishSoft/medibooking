import { useId, useState } from "react";

function YearsOfPracticeField() {
  const inputId = useId();
  const [years, setYears] = useState("12");
  const numericYears = Number(years) || 0;

  function adjustYears(amount: number) {
    setYears(String(Math.max(0, numericYears + amount)));
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

      <div className="flex min-h-11 items-center gap-1 rounded-lg bg-surface-lowest p-1 shadow-elevation-1 focus-within:ring-2 focus-within:ring-primary/50">
        <button
          aria-label="Decrease years of clinical practice"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-surface-container-high text-headline-sm text-on-surface transition-colors hover:bg-surface-highest disabled:cursor-not-allowed disabled:opacity-50"
          disabled={numericYears === 0}
          onClick={() => adjustYears(-1)}
          type="button"
        >
          −
        </button>
        <input
          className="min-w-0 flex-1 bg-transparent text-center text-body-md text-on-surface outline-none"
          id={inputId}
          min="0"
          name="yearsOfPractice"
          onChange={(event) => setYears(event.currentTarget.value)}
          required
          type="number"
          value={years}
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
    </div>
  );
}

export default YearsOfPracticeField;
