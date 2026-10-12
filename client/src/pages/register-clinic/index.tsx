import { useState } from "react";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ClinicBuildingIcon,
  ClinicNetworkIcon,
  EmailIcon,
  InfoCircleIcon,
  LicenseCardIcon,
  LockIcon,
  SecurityKeyIcon,
} from "../../assets/icons/Icons";
import FormInputsWrapper from "../../components/FormInputsWrapper";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import {
  clinicRegistrationFormSchema,
  type ClinicRegistrationFormInput,
  type ClinicRegistrationFormOutput,
} from "../../schemas/clinicRegistration.schema";

function ClinicRegistrationPage() {
  const [submissionMessage, setSubmissionMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    ClinicRegistrationFormInput,
    unknown,
    ClinicRegistrationFormOutput
  >({
    resolver: zodResolver(clinicRegistrationFormSchema),
    defaultValues: {
      city: "Tbilisi (Metropolitan Area)",
      legalCertification: false,
      serviceTerms: false,
    },
  });

  const onSubmit = (data: ClinicRegistrationFormOutput) => {
    // TODO: call clinic registration API
    void data;
    setSubmissionMessage(
      "Clinic registration is not connected to a submission service yet.",
    );
  };

  return (
    <div className="min-h-screen bg-surface-dim font-inter text-on-surface">
      <Header role="Clinic" />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-label-md text-secondary">
              <ClinicBuildingIcon aria-hidden="true" className="h-4 w-4" />
              INSTITUTIONAL TENANCY GATEWAY
            </span>
            <h1 className="mt-3 text-headline-xl text-on-surface">
              Register Medical Clinic or Network Hub
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Establish authorized clinical tenancy, configure practitioner
              scheduling rosters, and connect directly to the national
              healthcare dispatch network.
            </p>
          </div>

          <form
            className="space-y-5"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInputsWrapper
              formInputsSectionNumber={1}
              formInputsSectionTitle="Clinic Identity & Legal Entity"
              formInputsSectionDescription="Public brand credentials and official state commercial registry details"
              headerAdornment={
                <ClinicBuildingIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-secondary"
                />
              }
            >
              <div className="space-y-4">
                <Input
                  error={errors.name?.message}
                  label="Clinic Name (Public Trade Designation)"
                  labelAdornment={
                    <span className="text-body-sm text-on-surface-variant">
                      Patient visible
                    </span>
                  }
                  leadingElement={
                    <ClinicBuildingIcon className="h-4 w-4" />
                  }
                  placeholder="e.g. Tbilisi Central Clinic (Main Campus)"
                  required
                  {...register("name")}
                />
                <Input
                  error={errors.legalName?.message}
                  label="Clinic Legal / Corporate Name"
                  leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                  placeholder="e.g. Tbilisi Healthcare Partners LLC"
                  required
                  {...register("legalName")}
                />
                <Input
                  error={errors.taxId?.message}
                  label="Tax / MoH Identification Code"
                  leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                  placeholder="e.g. 404889211-MOH"
                  required
                  {...register("taxId")}
                />
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber={2}
              formInputsSectionTitle="Administrative Root Credentials"
              formInputsSectionDescription="Primary clinical operational officer credentials for platform access"
              headerAdornment={
                <SecurityKeyIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-secondary"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="email"
                  error={errors.email?.message}
                  label="Admin Root Email"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  placeholder="admin.ops@tbilisiclinic.ge"
                  required
                  type="email"
                  {...register("email")}
                />
                <Input
                  autoComplete="tel"
                  error={errors.phone?.message}
                  label="Admin Mobile Phone"
                  leadingElement={
                    <span className="text-label-md">+995 (GE)</span>
                  }
                  placeholder="599 11 22 33"
                  required
                  type="tel"
                  {...register("phone")}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.password?.message}
                  label="Administrative Password"
                  leadingElement={<LockIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("password")}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  label="Confirm Administrative Password"
                  leadingElement={<SecurityKeyIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("confirmPassword")}
                />
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber={3}
              formInputsSectionTitle="Public Clinic Contact & Dispatch"
              formInputsSectionDescription="Patient direct contact numbers, physical emergency triage address, and dispatch channels"
              headerAdornment={
                <ClinicNetworkIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-secondary"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="email"
                  error={errors.publicEmail?.message}
                  label="Public Inquiries Email"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  placeholder="info@tbilisiclinic.ge"
                  required
                  type="email"
                  {...register("publicEmail")}
                />
                <Input
                  autoComplete="tel"
                  error={errors.receptionPhone?.message}
                  label="Direct Reception / Hotline"
                  leadingElement={<span aria-hidden="true">☎</span>}
                  placeholder="+995 (32) 2 123 456"
                  required
                  type="tel"
                  {...register("receptionPhone")}
                />
              </div>

              <Input
                autoComplete="street-address"
                className="mt-4"
                error={errors.address?.message}
                label="Street Address, Building / Wing / Floor"
                leadingElement={<InfoCircleIcon className="h-4 w-4" />}
                placeholder="e.g. 74 Chavchavadze Ave, Building B, Entrance 3"
                required
                {...register("address")}
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(8rem,1fr)]">
                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="city"
                  >
                    City / Autonomous Region
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </label>
                  <select
                    aria-invalid={!!errors.city}
                    autoComplete="address-level2"
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
                    id="city"
                    {...register("city")}
                  >
                    <option>Tbilisi (Metropolitan Area)</option>
                    <option>Adjara</option>
                    <option>Imereti</option>
                    <option>Kakheti</option>
                    <option>Other</option>
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <Input
                  autoComplete="postal-code"
                  error={errors.postalCode?.message}
                  label="Postal Code"
                  placeholder="0162"
                  required
                  {...register("postalCode")}
                />
              </div>
            </FormInputsWrapper>

            <section className="space-y-3 rounded-xl bg-surface-container p-4 shadow-elevation-1 sm:p-5">
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                  <input
                    aria-invalid={!!errors.legalCertification}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-secondary"
                    type="checkbox"
                    {...register("legalCertification")}
                  />
                  <span>
                    I certify under legal penalty that this healthcare facility
                    holds an active, unencumbered Georgian Ministry of
                    Healthcare (MoH) license, clinical operating permits, and
                    registered liability protocols.
                  </span>
                </label>
                {errors.legalCertification && (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.legalCertification.message}
                  </p>
                )}
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                  <input
                    aria-invalid={!!errors.serviceTerms}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-secondary"
                    type="checkbox"
                    {...register("serviceTerms")}
                  />
                  <span>
                    We accept the{" "}
                    <span className="text-secondary">
                      Enterprise Healthcare B2B Terms of Service
                    </span>
                    , HL7/FHIR Integration Pipeline standards, and end-to-end
                    encrypted Telehealth Data Management rules.
                  </span>
                </label>
                {errors.serviceTerms && (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.serviceTerms.message}
                  </p>
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <Button
                disabled={isSubmitting}
                variant="accent"
                type="submit"
              >
                <LockIcon aria-hidden="true" className="h-4 w-4" />
                Clinic Registration
              </Button>
              <p className="text-body-sm text-on-surface-variant">
                Already authorized?{" "}
                <Link
                  className="font-semibold text-secondary hover:underline"
                  state={{ showClinicSignIn: true }}
                  to="/path-selector"
                >
                  Sign In →
                </Link>
              </p>
            </div>

            {submissionMessage && (
              <p className="text-body-sm text-error" role="alert">
                {submissionMessage}
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ClinicRegistrationPage;
