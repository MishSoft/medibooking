export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
};

// Toggle-button group for filters; DashboardTabs stays reserved for page tabs
function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-surface-container p-1"
      role="group"
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            aria-pressed={isActive}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? "bg-surface-container-high text-primary shadow-elevation-2"
                : "text-on-surface-variant hover:bg-surface-highest hover:text-on-surface"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
            {option.count !== undefined && (
              <span className="rounded-sm bg-surface-highest px-1.5 font-code text-code-sm">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
