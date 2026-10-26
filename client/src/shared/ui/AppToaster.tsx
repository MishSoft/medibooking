import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "font-inter flex w-full items-start gap-3 rounded-xl bg-surface-container-high p-4 text-on-surface shadow-elevation-3",
          title: "text-label-lg",
          description: "text-body-sm text-on-surface-variant",
          icon: "mt-0.5",
          closeButton: "!bg-surface-container-high !text-on-surface-variant",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-error",
          info: "[&_[data-icon]]:text-info",
          warning: "[&_[data-icon]]:text-warning",
        },
      }}
    />
  );
}
