function ClinicRegistration() {
  return (
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-cyan-200 sm:text-sm">
        <svg
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5v13.5H3.75zM7.5 8.25h3v3h-3zM13.5 8.25h3m-3 3h3M7.5 14.25h3m3 0h3"
          />
        </svg>
        FOR HOSPITALS &amp; MEDICAL CENTERS
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-cyan-300 sm:text-6xl">
        <span className="text-white">Register Your</span> <br />
        Clinic
      </h1>
      <p className="mt-4 max-w-[500px] text-base leading-6 text-slate-300 sm:text-lg sm:leading-7">
        Deploy your medical center into Georgia&apos;s unified clinical dispatch
        network with automated practitioner scheduling and room telemetry.
      </p>
      <div className="mt-6 rounded-2xl border border-cyan-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-7">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-300">
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="12" cy="12" r="2" />
              <circle cx="5" cy="7" r="1.5" />
              <circle cx="19" cy="7" r="1.5" />
              <circle cx="5" cy="17" r="1.5" />
              <circle cx="19" cy="17" r="1.5" />
              <path
                strokeLinecap="round"
                d="m10.4 11.1-4-3m7.2 2 4-3m-7.2 5.8-4 3m7.2-2 4 3"
              />
            </svg>
          </span>
          <h2 className="text-lg font-semibold text-white">120+ Facilities</h2>
        </div>
        <p className="mt-3 max-w-[240px] text-sm leading-6 text-slate-300">
          Connected hospital networks
        </p>
      </div>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
        <li className="flex items-start gap-3">
          <svg
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 10 3 3 7-7"
            />
          </svg>
          Real-time multi-doctor schedule coordination &amp; billing sync
        </li>
        <li className="flex items-start gap-3">
          <svg
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"
            fill="none"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 10 3 3 7-7"
            />
          </svg>
          Dedicated enterprise migration support &amp; 99.98% uptime SLA
        </li>
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          className="inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_8px_28px_rgba(34,211,238,0.2)] transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          type="button"
        >
          Apply for Clinic Tenancy
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5v13.5H3.75zM8 8.25v3m8-3v3M7.5 18.75v-3h3v3m2-7.5h3m-3 3h3"
            />
          </svg>
        </button>
        <a
          className="text-sm text-slate-400 transition-colors hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          href="#clinic-admin"
        >
          Clinic admin? <b className="underline">Sign in</b>
        </a>
      </div>
    </div>
  );
}

export default ClinicRegistration;
