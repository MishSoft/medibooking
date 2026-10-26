import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

function Panel({
  title,
  description,
  actions,
  children,
  className = "",
  ...sectionProps
}: PanelProps) {
  return (
    <section
      className={`rounded-xl bg-surface-container-low p-5 shadow-elevation-1 sm:p-6 ${className}`}
      {...sectionProps}
    >
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-headline-md">{title}</h2>}
            {description && (
              <p className="mt-1 text-body-sm text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export default Panel;
