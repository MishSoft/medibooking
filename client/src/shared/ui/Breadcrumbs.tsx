export type BreadcrumbItem = {
  label: string;
  // Omitted on the last item, which is the current page
  onClick?: () => void;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-body-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-1" key={`${index}-${item.label}`}>
              {index > 0 && (
                <span aria-hidden="true" className="text-on-surface-variant">
                  ›
                </span>
              )}
              {isCurrent || !item.onClick ? (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "font-medium text-on-surface"
                      : "text-on-surface-variant"
                  }
                >
                  {item.label}
                </span>
              ) : (
                <button
                  className="rounded-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
