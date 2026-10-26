import type { ComponentType, SVGProps } from "react";

export type DashboardTab<T extends string = string> = {
  id: T;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type DashboardTabsProps<T extends string> = {
  tabs: DashboardTab<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  ariaLabel: string;
};

function DashboardTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
}: DashboardTabsProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container-low p-1 shadow-elevation-1"
      role="tablist"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeTab;

        return (
          <button
            aria-controls={`panel-${id}`}
            aria-selected={isActive}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isActive
                ? "bg-surface-container-high text-primary shadow-elevation-2"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
            id={`tab-${id}`}
            key={id}
            onClick={() => onChange(id)}
            role="tab"
            type="button"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default DashboardTabs;
