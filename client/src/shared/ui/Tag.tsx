import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  tone?: "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error";
};

const toneClasses = {
  neutral: "text-on-surface-variant",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
};

function Tag({ children, tone = "neutral" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-surface-highest px-2 py-1 text-label-md ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export default Tag;
