import type { ReactNode } from "react";

type FormInputsWrapperProps = {
  formInputsSectionNumber: string | number;
  formInputsSectionTitle: string;
  formInputsSectionDescription: string;
  headerAdornment?: ReactNode;
  children: ReactNode;
};

function FormInputsWrapper({
  formInputsSectionNumber,
  formInputsSectionTitle,
  formInputsSectionDescription,
  headerAdornment,
  children,
}: FormInputsWrapperProps) {
  return (
    <section className="rounded-xl bg-surface-container p-4 shadow-elevation-1 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-label-md text-primary">
            {formInputsSectionNumber}
          </span>
          <div className="min-w-0">
            <h2 className="text-headline-sm text-on-surface">
              {formInputsSectionTitle}
            </h2>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">
              {formInputsSectionDescription}
            </p>
          </div>
        </div>
        {headerAdornment && (
          <div className="shrink-0">{headerAdornment}</div>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export default FormInputsWrapper;
