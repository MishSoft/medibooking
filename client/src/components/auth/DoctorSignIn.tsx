import {
  FaceBiometricIcon,
  InfoCircleIcon,
  LicenseCardIcon,
  LockIcon,
  PractitionerCalendarIcon,
  PractitionerSignInIcon,
} from "../../assets/icons/Icons";

function DoctorSignIn() {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-emerald-300 sm:text-sm">
            <PractitionerCalendarIcon
              aria-hidden="true"
              className="h-4 w-4"
            />
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
          <InfoCircleIcon
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"
          />
          <p>
            Doctor accounts are provisioned by accredited clinics upon
            credentialing — no self-registration required.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
            <LicenseCardIcon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400"
            />
            <input
              aria-label="Practitioner license ID"
              className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
              placeholder="LIC-GEO-84920"
            />
          </label>
          <label className="flex min-w-0 items-center gap-3 rounded-lg border border-white/5 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200">
            <LockIcon
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400"
            />
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
            <FaceBiometricIcon
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
            />
            Passkey / Biometric
          </span>
          <button
            className="cursor-pointer inline-flex items-center gap-3 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            type="button"
          >
            Practitioner Sign In
            <PractitionerSignInIcon
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DoctorSignIn;
