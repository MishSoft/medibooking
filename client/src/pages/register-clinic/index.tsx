import { useState, type FormEvent } from "react";
import { Link } from "react-router";
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

function ClinicRegistrationPage() {
  const [submissionMessage, setSubmissionMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (formData.get("adminPassword") !== formData.get("confirmPassword")) {
      setSubmissionMessage(
        "Passwords do not match. Please check both password fields.",
      );
      return;
    }

    setSubmissionMessage(
      "Clinic registration is not connected to a submission service yet.",
    );
  }

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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  label="Clinic Name (Public Trade Designation)"
                  labelAdornment={
                    <span className="text-body-sm text-on-surface-variant">
                      Patient visible
                    </span>
                  }
                  leadingElement={
                    <ClinicBuildingIcon className="h-4 w-4" />
                  }
                  name="clinicName"
                  placeholder="e.g. Tbilisi Central Clinic (Main Campus)"
                  required
                />
                <Input
                  label="Clinic Legal / Corporate Name"
                  leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                  name="legalName"
                  placeholder="e.g. Tbilisi Healthcare Partners LLC"
                  required
                />
                <Input
                  label="Tax / MoH Identification Code"
                  leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                  name="identificationCode"
                  placeholder="e.g. 404889211-MOH"
                  required
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
                  label="Admin Root Email"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  name="adminEmail"
                  placeholder="admin.ops@tbilisiclinic.ge"
                  required
                  type="email"
                />
                <Input
                  autoComplete="tel"
                  label="Admin Mobile Phone"
                  leadingElement={
                    <span className="text-label-md">+995 (GE)</span>
                  }
                  name="adminMobile"
                  placeholder="599 11 22 33"
                  required
                  type="tel"
                />
                <Input
                  autoComplete="new-password"
                  label="Administrative Password"
                  leadingElement={<LockIcon className="h-4 w-4" />}
                  name="adminPassword"
                  required
                  type="password"
                />
                <Input
                  autoComplete="new-password"
                  label="Confirm Administrative Password"
                  leadingElement={<SecurityKeyIcon className="h-4 w-4" />}
                  name="confirmPassword"
                  required
                  type="password"
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
                  label="Public Inquiries Email"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  name="publicEmail"
                  placeholder="info@tbilisiclinic.ge"
                  required
                  type="email"
                />
                <Input
                  autoComplete="tel"
                  label="Direct Reception / Hotline"
                  leadingElement={<span aria-hidden="true">☎</span>}
                  name="hotline"
                  placeholder="+995 (32) 2 123 456"
                  required
                  type="tel"
                />
              </div>

              <Input
                autoComplete="street-address"
                className="mt-4"
                label="Street Address, Building / Wing / Floor"
                leadingElement={<InfoCircleIcon className="h-4 w-4" />}
                name="streetAddress"
                placeholder="e.g. 74 Chavchavadze Ave, Building B, Entrance 3"
                required
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(8rem,1fr)]">
                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="region"
                  >
                    City / Autonomous Region
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </label>
                  <select
                    autoComplete="address-level2"
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
                    defaultValue="Tbilisi (Metropolitan Area)"
                    id="region"
                    name="region"
                    required
                  >
                    <option>Tbilisi (Metropolitan Area)</option>
                    <option>Adjara</option>
                    <option>Imereti</option>
                    <option>Kakheti</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input
                  autoComplete="postal-code"
                  label="Postal Code"
                  name="postalCode"
                  placeholder="0162"
                  required
                />
              </div>
            </FormInputsWrapper>

            <section className="space-y-3 rounded-xl bg-surface-container p-4 shadow-elevation-1 sm:p-5">
              <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                <input
                  className="mt-0.5 h-4 w-4 shrink-0 accent-secondary"
                  name="legalCertification"
                  required
                  type="checkbox"
                />
                <span>
                  I certify under legal penalty that this healthcare facility
                  holds an active, unencumbered Georgian Ministry of Healthcare
                  (MoH) license, clinical operating permits, and registered
                  liability protocols.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                <input
                  className="mt-0.5 h-4 w-4 shrink-0 accent-secondary"
                  name="serviceTerms"
                  required
                  type="checkbox"
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
            </section>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <Button
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
