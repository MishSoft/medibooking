function PathSelectorPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060E20]">
      <div
        className="relative z-[9] h-screen w-screen -translate-x-1/2 skew-x-[-15deg]
         bg-[linear-gradient(90deg,#071913_0%,#0B1326_50%,#0A1B24_100%)]
         after:absolute after:right-0 after:top-0 after:h-full after:w-[1px]
         after:bg-[repeating-linear-gradient(to_bottom,#4EDEA3_0_4px,transparent_4px_6px)]"
      >
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 left-[58%] w-28 skew-x-[15deg] sm:w-36 lg:w-40"
          src="/assets/icons/charty-line.svg"
        />
        <section className="absolute inset-0 flex items-center justify-end px-6 py-5 sm:px-10 lg:pr-[calc(7vw+100px)] lg:pl-[7vw]">
          <div className="w-full max-w-[560px] skew-x-[15deg]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-emerald-300 sm:text-sm">
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
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
                />
              </svg>
              FOR PATIENTS &amp; FAMILIES
            </div>

            <h2 className="whitespace-nowrap text-4xl font-bold tracking-tight text-emerald-300 sm:text-5xl">
              <span className="text-white">Register as a </span> Patient
            </h2>
            <p className="mt-3 max-w-[560px] text-base leading-6 text-slate-300 sm:text-lg sm:leading-7">
              Instant access to certified medical specialists, 60-second
              appointment booking, and encrypted sovereign health records.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-300">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m12 3 2.2 1.4 2.6-.2 1.2 2.3 2.3 1.2-.2 2.6L21.5 12l-1.4 2.2.2 2.6-2.3 1.2-1.2 2.3-2.6-.2L12 21.5l-2.2-1.4-2.6.2L6 18l-2.3-1.2.2-2.6L2.5 12l1.4-2.2-.2-2.6L6 6l1.2-2.3 2.6.2L12 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 12 2 2 4-4"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    140+ Doctors
                  </h3>
                  <p className="text-sm text-slate-300">
                    Top-rated specialists
                  </p>
                </div>
              </div>

              <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-300">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7.5h6l2 2h8v9H4v-11Zm0 0V5.5h6l2 2m-4 5h8"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">EHR Vault</h3>
                  <p className="text-sm text-slate-300">
                    Encrypted health records
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                className="inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-[0_8px_28px_rgba(52,211,153,0.2)] transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                type="button"
              >
                Continue to Patient Registration
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-6-6 6 6-6 6"
                  />
                </svg>
              </button>
              <a
                className="text-sm text-slate-300 transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
                href="#patient-sign-in"
              >
                Existing patient? <b className="underline">Sign in</b>
              </a>
            </div>

            <div className="my-4 h-px bg-gradient-to-r from-emerald-300/25 via-emerald-100/15 to-transparent" />

            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-emerald-300 sm:text-sm">
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
                      d="M7 4v3m10-3v3M5 9h14M6 6h12a2 2 0 0 1 2 2v11H4V8a2 2 0 0 1 2-2Zm4 6 2 2 4-4"
                    />
                  </svg>
                  PRACTITIONER PORTAL
                </div>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Doctor Sign In
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300 sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Accredited Medical Staff
              </span>
            </div>

            <div className="rounded-xl border border-emerald-100/10 bg-slate-800/90 px-4 py-3 text-sm leading-5 text-slate-200">
              <div className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11v5m0-8h.01"
                  />
                </svg>
                <p>
                  Doctor accounts are provisioned by accredited clinics upon
                  credentialing — no self-registration required.
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5h14v14H5zM8 9h8m-8 4h5"
                    />
                  </svg>
                  <input
                    aria-label="Practitioner license ID"
                    className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
                    placeholder="LIC-GEO-84920"
                  />
                </label>
                <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path
                      strokeLinecap="round"
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                    />
                  </svg>
                  <input
                    aria-label="Practitioner password"
                    className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
                    placeholder="••••••••••"
                    type="password"
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 15c1.5-2 6.5-2 8 0M9 9h.01M15 9h.01"
                    />
                  </svg>
                  Passkey / Biometric
                </span>
                <button
                  className="inline-flex items-center gap-3 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
                  type="button"
                >
                  Practitioner Sign In
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
                      d="M10 17l5-5-5-5m5 5H3m18-8v16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="absolute inset-0 -z-[9] overflow-hidden bg-[linear-gradient(105deg,#03151F_0%,#09152B_50%,#060E20_100%)]">
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 w-48 sm:w-64 lg:w-80"
          src="/assets/icons/building-shape.svg"
        />
        <section className="flex min-h-screen items-center justify-end px-6 py-5 sm:px-10 lg:px-[7vw]">
          <div className="w-full max-w-[520px]">
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
              Deploy your medical center into Georgia&apos;s unified clinical
              dispatch network with automated practitioner scheduling and room
              telemetry.
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
                <h2 className="text-lg font-semibold text-white">
                  120+ Facilities
                </h2>
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
        </section>
      </div>
    </main>
  );
}

export default PathSelectorPage;
