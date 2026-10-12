function Footer() {
  return (
    <footer className="flex w-full flex-wrap items-center justify-between gap-x-8 gap-y-4 bg-surface-lowest px-5 py-6 font-inter sm:px-8 lg:px-12">
      <p className="text-body-sm text-on-surface-variant">
        <span className="font-semibold text-primary">MediBooking</span>
        <span className="mx-2 text-on-surface">© 2025</span>
        Clinical Cloud Infrastructure. All clinical rights reserved.
      </p>

      <nav
        aria-label="Compliance and support"
        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-label-md text-on-surface-variant"
      >
        <span>HIPAA Compliance</span>
        <span>Security Standards</span>
        <span>Emergency Support</span>
      </nav>
    </footer>
  );
}

export default Footer;
