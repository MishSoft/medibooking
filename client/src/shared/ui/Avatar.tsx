type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-label-md",
  md: "h-12 w-12 text-label-lg",
  lg: "h-16 w-16 text-headline-sm",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-surface-highest text-primary ${sizeClasses[size]}`}
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
