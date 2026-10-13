import type { ComponentType, ReactNode, SVGProps } from "react";

type EmptyStateProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: ReactNode;
};

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface-container px-6 py-12 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-primary">
        <Icon aria-hidden="true" className="h-6 w-6" />
      </span>
      <p className="text-headline-sm">{title}</p>
      {description && (
        <p className="max-w-sm text-body-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

export default EmptyState;
