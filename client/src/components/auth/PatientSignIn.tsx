import {
  ArrowRightIcon,
  FaceBiometricIcon,
  LockIcon,
  PatientIdIcon,
  PatientProfileIcon,
} from "../../assets/icons/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { patientSignInSchema } from "../../schemas/signIn.schema";
import type { LoginInput } from "../../schemas/auth.schema";
import FieldError from "../../shared/ui/FieldError";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";
import { authStorage } from "../../api/auth.storage";

type PatientSignInProps = {
  onRegisterClick: () => void;
};

const fieldBorder = (hasError: boolean) =>
  hasError ? "border-rose-400/60" : "border-white/5";

function PatientSignIn({ onRegisterClick }: PatientSignInProps) {
  const [loginError, setLoginError] = useState("");
  const login = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(patientSignInSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoginError("");
    try {
      const response = await login.mutateAsync(data);
      console.log("Patient logged in:", response);

      if (!response.data) {
        throw new Error("Login failed.");
      }

      authStorage.setSession(response.data.token, response.data.user);
      navigate("/dashboard/patient");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold tracking-[0.1em] text-emerald-300 sm:text-sm">
        <PatientProfileIcon aria-hidden="true" className="h-4 w-4" />
        FOR PATIENTS &amp; FAMILIES
      </div>
      <h2 className="text-4xl font-bold tracking-tight text-emerald-300 sm:text-5xl">
        <span className="text-white">Patient</span> Sign In
      </h2>
      <p className="mt-2 max-w-[560px] text-sm leading-6 text-slate-300 sm:text-base">
        Access your health records, view upcoming specialist appointments, and
        manage prescriptions securely.
      </p>

      <form
        className="mt-5 rounded-2xl border border-emerald-100/10 bg-[linear-gradient(135deg,#10243A_0%,#0D192C_100%)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className={`flex min-w-0 items-center gap-3 rounded-lg border ${fieldBorder(!!errors.identifier)} bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200`}
        >
          <PatientIdIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
          <input
            autoComplete="username"
            aria-describedby="patient-identifier-error"
            aria-invalid={!!errors.identifier}
            aria-label="Patient ID or phone number"
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="01024089921"
            type="text"
            {...register("identifier")}
          />
          <span className="shrink-0 rounded border border-emerald-300/15 bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-emerald-300">
            GEO · CITIZEN
          </span>
        </div>
        <FieldError
          id="patient-identifier-error"
          message={errors.identifier?.message}
        />

        <div
          className={`mt-2 flex min-w-0 items-center gap-3 rounded-lg border ${fieldBorder(!!errors.password)} bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200`}
        >
          <LockIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-400"
          />
          <input
            autoComplete="current-password"
            aria-describedby="patient-password-error"
            aria-invalid={!!errors.password}
            aria-label="Patient password"
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="••••••••••"
            type="password"
            {...register("password")}
          />
          <button
            className="shrink-0 text-xs text-emerald-300 transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            type="button"
          >
            Forgot?
          </button>
        </div>
        <FieldError
          id="patient-password-error"
          message={errors.password?.message}
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
            <input
              className="h-4 w-4 accent-emerald-400"
              type="checkbox"
            />
            Remember this device
          </label>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 sm:text-sm">
            <FaceBiometricIcon aria-hidden="true" className="h-4 w-4" />
            Biometric / Passkey Active
          </span>
        </div>

        <button
          className="cursor-pointer mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-[0_8px_28px_rgba(52,211,153,0.2)] transition-colors hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          Sign In to Patient Portal
          <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
        </button>
        <FieldError id="patient-login-error" message={loginError} />
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-300">
        <span>New patient?</span>
        <button
          className="cursor-pointer font-semibold text-emerald-300 underline decoration-emerald-300/50 underline-offset-2 transition-colors hover:text-emerald-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
          onClick={onRegisterClick}
          type="button"
        >
          Register as a Patient
        </button>
      </div>
      <div className="my-4 h-px bg-gradient-to-r from-emerald-300/25 via-emerald-100/15 to-transparent" />
    </div>
  );
}

export default PatientSignIn;
