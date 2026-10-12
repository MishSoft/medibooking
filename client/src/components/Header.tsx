type HeaderProps = {
  role?: string;
};

function Header({ role = "Patient" }: HeaderProps) {
  return (
    <header
      aria-label="MediBooking"
      className="flex min-h-24 w-full items-center justify-between bg-surface-lowest px-5 sm:px-8 lg:px-12"
    >
      <span className="font-inter text-headline-sm font-semibold text-on-surface">
        MediBooking
      </span>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface">
          <span className="text-primary">ROLE</span>
          {role}
        </span>
        <span className="rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface-variant">
          EN
        </span>
      </div>
    </header>
  );
}

export default Header;
