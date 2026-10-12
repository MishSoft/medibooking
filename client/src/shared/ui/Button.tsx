import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent";
};

function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...buttonProps
}: ButtonProps) {
  const variantClasses =
    variant === "primary"
      ? "bg-primary-container text-on-primary-container shadow-elevation-1 hover:bg-primary"
      : variant === "accent"
        ? "bg-secondary-container text-on-secondary shadow-elevation-1 hover:bg-secondary"
        : "bg-surface-container-high text-on-surface hover:bg-surface-highest";

  return (
    <button
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-label-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export default Button;
