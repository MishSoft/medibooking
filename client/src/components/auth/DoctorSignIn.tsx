import {
  FaceBiometricIcon,
  InfoCircleIcon,
  LicenseCardIcon,
  LockIcon,
  PractitionerCalendarIcon,
  PractitionerSignInIcon,
} from "../../assets/icons/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { doctorSignInSchema } from "../../schemas/signIn.schema";
import type { LoginInput } from "../../schemas/auth.schema";
import FieldError from "../../shared/ui/FieldError";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";
import { authStorage } from "../../api/auth.storage";

const fieldBorder = (hasError: boolean) =>
  hasError ? "border-rose-400/60" : "border-white/5";

function DoctorSignIn() {
  const [loginError, setLoginError] = useState("");
  const login = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(doctorSignInSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoginError("");
    try {
      const response = await login.mutateAsync(data);

      if (!response.data) {
        throw new Error("Login failed.");
      }

      authStorage.setSession(response.data.token, response.data.user);
      navigate("/dashboard/doctor", { replace: true });
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed.");
    }
  };

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

      <form
        className="mt-3 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              className={`flex min-w-0 items-center gap-3 rounded-lg border ${fieldBorder(!!errors.identifier)} bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200`}
            >
              <LicenseCardIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-400"
              />
              <input
                autoComplete="username"
                aria-describedby="doctor-identifier-error"
                aria-invalid={!!errors.identifier}
                aria-label="Practitioner license ID"
                className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
                placeholder="LIC-GEO-84920"
                {...register("identifier")}
              />
            </label>
            <FieldError
              id="doctor-identifier-error"
              message={errors.identifier?.message}
            />
          </div>
          <div className="min-w-0">
            <label
              className={`flex min-w-0 items-center gap-3 rounded-lg border ${fieldBorder(!!errors.password)} bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200`}
            >
              <LockIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-slate-400"
              />
              <input
                autoComplete="current-password"
                aria-describedby="doctor-password-error"
                aria-invalid={!!errors.password}
                aria-label="Practitioner password"
                className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
                placeholder="••••••••••"
                type="password"
                {...register("password")}
              />
            </label>
            <FieldError
              id="doctor-password-error"
              message={errors.password?.message}
            />
          </div>
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
            className="cursor-pointer inline-flex items-center gap-3 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            Practitioner Sign In
            <PractitionerSignInIcon
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        </div>
        <FieldError id="doctor-login-error" message={loginError} />
      </form>
    </div>
  );
}

export default DoctorSignIn;
