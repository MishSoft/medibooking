import { useId, type TextareaHTMLAttributes } from "react";

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> & {
  label: string;
  className?: string;
};

function Textarea({ label, className = "", id, ...textareaProps }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-label-md text-on-surface"
        htmlFor={textareaId}
      >
        {label}
      </label>
      <textarea
        className="min-h-24 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none placeholder:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
        id={textareaId}
        {...textareaProps}
      />
    </div>
  );
}

export default Textarea;
