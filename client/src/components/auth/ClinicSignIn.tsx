import {
  ClinicBuildingIcon,
  EmailIcon,
  LockIcon,
  SecurityKeyIcon,
  ShieldCheckIcon,
} from "../../assets/icons/Icons";

type ClinicSignInProps = {
  onRegisterClick: () => void;
};

function ClinicSignIn({ onRegisterClick }: ClinicSignInProps) {
  return (
    <div className="-ml-[100px]">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-cyan-200 sm:text-xs">
        <ClinicBuildingIcon aria-hidden="true" className="h-4 w-4" />
        FOR HOSPITALS &amp; MEDICAL CENTERS · ENTERPRISE TENANCY
      </div>
      <h2 className="text-4xl font-bold tracking-tight text-cyan-300 sm:text-5xl">
        Sign In
      </h2>
      <p className="mt-2 max-w-[500px] text-sm leading-5 text-slate-300 sm:text-base sm:leading-6">
        Authenticate into your facility administration portal to coordinate
        physician schedules, cabinet telemetry, and clinical billing.
      </p>

      <form
        className="mt-5 rounded-2xl border border-cyan-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
          <EmailIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
          <input
            autoComplete="username"
            aria-label="Clinic administrator email"
            className="w-full min-w-0 bg-transparent font-mono text-xs outline-none placeholder:text-slate-400 sm:text-sm"
            placeholder="admin@clinic.ge"
            type="email"
          />
        </label>

        <label className="mt-2 flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
          <ClinicBuildingIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
          <input
            aria-label="Clinic facility ID"
            className="w-full min-w-0 bg-transparent font-mono text-xs outline-none placeholder:text-slate-400 sm:text-sm"
            placeholder="GEO-CLINIC-40488"
            type="text"
          />
          <span className="shrink-0 rounded border border-cyan-300/15 bg-cyan-300/10 px-2 py-1 text-[9px] font-semibold tracking-[0.06em] text-cyan-200">
            VERIFIED FACILITY
          </span>
        </label>

        <div className="mt-2 flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
          <LockIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
          <input
            autoComplete="current-password"
            aria-label="Clinic administrator password"
            className="w-full min-w-0 bg-transparent font-mono text-xs outline-none placeholder:text-slate-400 sm:text-sm"
            placeholder="••••••••••••••••"
            type="password"
          />
          <button
            className="shrink-0 text-[10px] text-cyan-200 transition-colors hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:text-xs"
            type="button"
          >
            Reset credentials
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[10px] leading-4 text-slate-300 sm:text-xs">
            <SecurityKeyIcon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-cyan-300"
            />
            <span>
              2FA / TOTP · Yubikey
              <br />
              5 FIPS slot active
            </span>
            <span className="rounded border border-cyan-300/20 bg-cyan-300/10 px-1.5 py-1 text-[9px] font-semibold text-cyan-200">
              ENFORCED
            </span>
          </div>
          <button
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-slate-950 shadow-[0_8px_28px_rgba(34,211,238,0.2)] transition-colors hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:px-4 sm:text-sm"
            type="submit"
          >
            Authenticate Clinic Admin
            <ShieldCheckIcon aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-300">
        <span>Need tenancy?</span>
        <button
          className="cursor-pointer font-semibold text-cyan-200 underline decoration-cyan-200/50 underline-offset-2 transition-colors hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          onClick={onRegisterClick}
          type="button"
        >
          Register Your Clinic
        </button>
      </div>
    </div>
  );
}

export default ClinicSignIn;
