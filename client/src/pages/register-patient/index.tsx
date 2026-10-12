import { useState } from "react";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInputsWrapper from "../../components/FormInputsWrapper";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {
  BadgeCheckIcon,
  InfoCircleIcon,
  LockIcon,
  PatientIdIcon,
  PatientProfileIcon,
  SecurityKeyIcon,
} from "../../assets/icons/Icons";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import { Gender } from "../../types/enums";
import {
  patientRegistrationFormSchema,
  type PatientRegistrationFormInput,
  type PatientRegistrationFormOutput,
} from "../../schemas/patientRegistration.schema";

const genderOptions = [
  { label: "Female", value: Gender.FEMALE },
  { label: "Male", value: Gender.MALE },
  { label: "Non-binary", value: Gender.NONBINARY },
  { label: "Undisclosed", value: Gender.UNDISCLOSED },
];

function PatientRegistrationPage() {
  const [submissionMessage, setSubmissionMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    PatientRegistrationFormInput,
    unknown,
    PatientRegistrationFormOutput
  >({
    resolver: zodResolver(patientRegistrationFormSchema),
    defaultValues: {
      gender: Gender.FEMALE,
      city: "Tbilisi (Central)",
      healthRecordConsent: false,
      appointmentReminders: false,
    },
  });

  const onSubmit = (data: PatientRegistrationFormOutput) => {
    // TODO: call patient registration API
    void data;
    setSubmissionMessage(
      "Registration is not connected to a submission service yet.",
    );
  };

  return (
    <div className="min-h-screen bg-surface-dim font-inter text-on-surface">
      <Header />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-label-md text-primary">
              <BadgeCheckIcon aria-hidden="true" className="h-4 w-4" />
              CLINICAL ONBOARDING
            </span>
            <h1 className="mt-3 text-headline-xl text-on-surface">
              Create Patient Health Profile
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Register your sovereign patient credential to schedule specialist
              consultations, sync clinical diagnostics, and manage encrypted
              electronic health records.
            </p>
          </div>

          <form
            className="space-y-5"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInputsWrapper
              formInputsSectionNumber={1}
              formInputsSectionTitle="Personal Identity"
              formInputsSectionDescription="Legal name and biological identifiers as shown on official records"
              headerAdornment={
                <PatientProfileIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-on-surface-variant"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  label="First Name (Legal)"
                  placeholder="e.g. Tamar"
                  required
                  {...register("firstName")}
                />
                <Input
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  label="Last Name (Surname)"
                  placeholder="e.g. Chikovani"
                  required
                  {...register("lastName")}
                />
              </div>

              <fieldset className="mt-4">
                <legend className="mb-1.5 text-label-md text-on-surface">
                  Biological / Legal Gender
                </legend>
                <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface-lowest p-1 sm:grid-cols-4">
                  {genderOptions.map(({ label, value }) => (
                    <label
                      className="cursor-pointer rounded-md px-2 py-2 text-center text-label-md text-on-surface-variant transition-colors has-[:checked]:bg-surface-container-high has-[:checked]:text-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
                      key={value}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        value={value}
                        {...register("gender")}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.gender.message}
                  </p>
                )}
              </fieldset>

              <Input
                className="mt-4"
                error={errors.birthDate?.message}
                label="Date of Birth"
                labelAdornment={
                  <span className="text-body-sm text-on-surface-variant">
                    DD/MM/YYYY
                  </span>
                }
                required
                type="date"
                {...register("birthDate")}
              />
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber={2}
              formInputsSectionTitle="Official Identification & Contact"
              formInputsSectionDescription="Used strictly for clinical validation and emergency alerts"
              headerAdornment={
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-label-md text-primary">
                  <BadgeCheckIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">
                    Encrypted &amp; MoH Verified
                  </span>
                  <span className="sm:hidden">Verified</span>
                </span>
              }
            >
              <Input
                error={errors.personalId?.message}
                label="National ID Number (Personal Code)"
                labelAdornment={
                  <span className="text-label-md text-secondary">
                    11 Digits
                  </span>
                }
                leadingElement={<PatientIdIcon className="h-4 w-4" />}
                maxLength={11}
                placeholder="01024018492"
                required
                trailingElement={
                  <span className="rounded-md bg-surface-container-high px-2 py-1 text-label-md text-primary">
                    <BadgeCheckIcon
                      aria-hidden="true"
                      className="mr-1 inline h-3.5 w-3.5"
                    />
                    GEO ID
                  </span>
                }
                type="text"
                inputMode="numeric"
                {...register("personalId")}
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="tel-national"
                  error={errors.phone?.message}
                  label="Mobile Number"
                  leadingElement={
                    <span className="text-label-md">+995 (GE)</span>
                  }
                  placeholder="599 12 34 56"
                  required
                  type="tel"
                  {...register("phone")}
                />
                <Input
                  autoComplete="email"
                  error={errors.email?.message}
                  label="Email Address"
                  leadingElement={<span aria-hidden="true">@</span>}
                  placeholder="patient@clinicalmail.ge"
                  required
                  type="email"
                  {...register("email")}
                />
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber={3}
              formInputsSectionTitle="Residential Location & Emergency"
              formInputsSectionDescription="For matching regional ambulatory networks & critical dispatch"
              headerAdornment={
                <InfoCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-on-surface-variant"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="street-address"
                  error={errors.address?.message}
                  label="Street Address, Apt / Floor"
                  placeholder="74 Chavchavadze Ave, Apt 12B"
                  required
                  {...register("address")}
                />
                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="city"
                  >
                    City / District
                  </label>
                  <select
                    aria-invalid={!!errors.city}
                    autoComplete="address-level2"
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    id="city"
                    {...register("city")}
                  >
                    <option>Tbilisi (Central)</option>
                    <option>Tbilisi (North)</option>
                    <option>Tbilisi (South)</option>
                    <option>Other</option>
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-surface-container-low p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-label-md text-on-surface">
                    <InfoCircleIcon
                      aria-hidden="true"
                      className="h-4 w-4 text-secondary"
                    />
                    Emergency Contact (Recommended)
                  </p>
                  <span className="text-body-sm text-on-surface-variant">
                    Optional
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    autoComplete="off"
                    error={errors.emergencyContactName?.message}
                    label="Contact Full Name"
                    placeholder="e.g. David Chikovani"
                    {...register("emergencyContactName")}
                  />
                  <Input
                    autoComplete="off"
                    error={errors.emergencyContactPhone?.message}
                    label="Relationship & Phone"
                    placeholder="e.g. Brother, 599 12 34 56"
                    {...register("emergencyContactPhone")}
                  />
                </div>
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber={4}
              formInputsSectionTitle="Security & Consent Protocols"
              formInputsSectionDescription="High-entropy cryptographic passkey & statutory medical agreements"
              headerAdornment={
                <SecurityKeyIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-on-surface-variant"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="new-password"
                  error={errors.password?.message}
                  label="Create Password"
                  leadingElement={<SecurityKeyIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("password")}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  label="Confirm Password"
                  leadingElement={<LockIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("confirmPassword")}
                />
              </div>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Must contain at least 10 characters, one number, and one
                clinical symbol.
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                    <input
                      aria-invalid={!!errors.healthRecordConsent}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      type="checkbox"
                      {...register("healthRecordConsent")}
                    />
                    <span>
                      I consent to biological health record processing under{" "}
                      <span className="text-primary">
                        Georgian MoH Guidelines &amp; HIPAA Data Encryption
                        Standards
                      </span>
                      .
                    </span>
                  </label>
                  {errors.healthRecordConsent && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.healthRecordConsent.message}
                    </p>
                  )}
                </div>
                <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                  <input
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    type="checkbox"
                    {...register("appointmentReminders")}
                  />
                  <span>
                    Enable automated encrypted SMS and WhatsApp reminders for
                    booked laboratory slots &amp; clinic appointments.
                  </span>
                </label>
              </div>
            </FormInputsWrapper>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <Button className="px-5" disabled={isSubmitting} type="submit">
                <LockIcon aria-hidden="true" className="h-4 w-4" />
                Complete Registration
              </Button>
              <p className="text-body-sm text-on-surface-variant">
                Already registered?{" "}
                <Link
                  className="font-semibold text-secondary hover:underline"
                  state={{ showPatientSignIn: true }}
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

export default PatientRegistrationPage;
