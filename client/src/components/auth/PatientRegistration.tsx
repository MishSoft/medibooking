function PatientRegistration() {
  return (
    <div>
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
        Instant access to certified medical specialists, 60-second appointment
        booking, and encrypted sovereign health records.
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
            <h3 className="text-base font-semibold text-white">140+ Doctors</h3>
            <p className="text-sm text-slate-300">Top-rated specialists</p>
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
            <p className="text-sm text-slate-300">Encrypted health records</p>
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
    </div>
  );
}

export default PatientRegistration;
