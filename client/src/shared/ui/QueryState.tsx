import type { ReactNode } from "react";
import { InfoCircleIcon } from "../../assets/icons/Icons";
import EmptyState from "./EmptyState";

type QueryStateProps = {
  isPending: boolean;
  error: Error | null;
  children: ReactNode;
};

// Shared loading / error wrapper for query-driven sections
function QueryState({ isPending, error, children }: QueryStateProps) {
  if (isPending) {
    return (
      <div aria-busy="true" aria-live="polite" className="space-y-3">
        <span className="sr-only">Loading…</span>
        {[0, 1, 2].map((key) => (
          <div
            className="h-24 animate-pulse rounded-xl bg-surface-container"
            key={key}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        description={error.message}
        icon={InfoCircleIcon}
        title="Something went wrong"
      />
    );
  }

  return children;
}

export default QueryState;
