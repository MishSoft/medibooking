import { useState } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  BadgeCheckIcon,
  EmailIcon,
  InfoCircleIcon,
  LicenseCardIcon,
  LockIcon,
  PatientIdIcon,
  PatientProfileIcon,
  PractitionerCalendarIcon,
  SecurityKeyIcon,
} from "../../assets/icons/Icons";
import FormInputsWrapper from "../../components/FormInputsWrapper";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Button from "../../shared/ui/Button";
import Input from "../../shared/ui/Input";
import { Gender } from "../../types/enums";
import {
  doctorRegistrationFormSchema,
  type DoctorRegistrationFormInput,
  type DoctorRegistrationFormOutput,
} from "../../schemas/doctorRegistration.schema";
import { toDoctorRegisterPayload } from "../../api/auth.api";
import { useClinics } from "../../hooks/useDoctors";
import { useRegisterDoctor } from "../../hooks/useRegisterDoctor";
import YearsOfPracticeField from "./components/YearsOfPracticeField";

const genderOptions = [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: "Non-binary", value: Gender.NONBINARY },
  { label: "Undisclosed", value: Gender.UNDISCLOSED },
];

const specialtyOptions = [
  "Cardiology & Cardiovascular Surgery",
  "Family Medicine",
  "Dermatology",
  "Endocrinology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Other",
];

function DoctorRegistrationPage() {
  const [submissionMessage, setSubmissionMessage] = useState("");
  const navigate = useNavigate();
  const registerDoctor = useRegisterDoctor();
  const clinics = useClinics();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    DoctorRegistrationFormInput,
    unknown,
    DoctorRegistrationFormOutput
  >({
    resolver: zodResolver(doctorRegistrationFormSchema),
    defaultValues: {
      gender: Gender.MALE,
      primarySpecialty: specialtyOptions[0],
      yearsOfPractice: 12,
      clinicId: "",
      city: "Tbilisi Metropolitan",
      licenseCertification: false,
      clinicalConsent: false,
    },
  });

  const onSubmit = async (data: DoctorRegistrationFormOutput) => {
    setSubmissionMessage("");
    try {
      await registerDoctor.mutateAsync(toDoctorRegisterPayload(data));
      navigate("/dashboard/clinic", { replace: true });
    } catch (error) {
      setSubmissionMessage(
        error instanceof Error ? error.message : "Doctor registration failed.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim font-inter text-on-surface">
      <Header role="Doctor" />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-label-md text-primary">
              <PractitionerCalendarIcon
                aria-hidden="true"
                className="h-4 w-4"
              />
              ACCREDITATION SLA &lt; 30 SECONDS
            </span>
            <h1 className="mt-3 text-headline-xl text-on-surface">
              Register Medical Practitioner
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Onboard authorized physicians and clinical specialists into the
              Georgian MoH dispatch network with automated consultation room
              allocation, real-time registry verification, and EHR
              prescription entitlement.
            </p>
          </div>

          <form
            className="space-y-5"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInputsWrapper
              formInputsSectionNumber="01"
              formInputsSectionTitle="Personal & Legal Identity"
              formInputsSectionDescription="Civil registry baseline matching national healthcare records"
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
                  label="First Name (Legal Given Name)"
                  placeholder="e.g. Tamar"
                  required
                  {...register("firstName")}
                />
                <Input
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  label="Last Name (Legal Surname)"
                  placeholder="e.g. Beridze"
                  required
                  {...register("lastName")}
                />
              </div>

              <fieldset className="mt-4">
                <legend className="mb-1.5 flex w-full items-center justify-between gap-3 text-label-md text-on-surface">
                  <span>
                    Gender Marker (Accreditation Record)
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    ISO 5218 Standard
                  </span>
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

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="bday"
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
                <Input
                  error={errors.personalId?.message}
                  label="National ID Number (GEO)"
                  labelAdornment={
                    <span className="text-label-md text-secondary">
                      11 Digits
                    </span>
                  }
                  leadingElement={<PatientIdIcon className="h-4 w-4" />}
                  maxLength={11}
                  placeholder="01024098412"
                  required
                  trailingElement={
                    <span className="rounded-md bg-surface-container-high px-2 py-1 text-label-md text-primary">
                      GEO-ID
                    </span>
                  }
                  inputMode="numeric"
                  {...register("personalId")}
                />
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber="02"
              formInputsSectionTitle="Professional Credentials & Licensing"
              formInputsSectionDescription="Validated against the National Healthcare Registry database"
              headerAdornment={
                <BadgeCheckIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-on-surface-variant"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    error={errors.licenseNo?.message}
                    label="Medical License Number"
                    leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                    placeholder="GEO-MED-77192-TB"
                    required
                    {...register("licenseNo")}
                  />
                  <p className="mt-1 text-body-sm text-on-surface-variant">
                    Issued by National Regulation Agency for Medical Activities
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="specialty"
                  >
                    Primary Medical Specialty
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </label>
                  <select
                    aria-invalid={!!errors.primarySpecialty}
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    id="specialty"
                    {...register("primarySpecialty")}
                  >
                    {specialtyOptions.map((specialty) => (
                      <option key={specialty}>{specialty}</option>
                    ))}
                  </select>
                  {errors.primarySpecialty && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.primarySpecialty.message}
                    </p>
                  )}
                  <p className="mt-1 text-body-sm text-on-surface-variant">
                    Subspecialties can be configured post-onboarding in EHR
                  </p>
                </div>

                <Controller
                  control={control}
                  name="yearsOfPractice"
                  render={({ field, fieldState }) => (
                    <YearsOfPracticeField
                      error={fieldState.error?.message}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />

                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="facility"
                  >
                    Associated Hospital / Clinical Facility
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </label>
                  <select
                    aria-invalid={!!errors.clinicId}
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    disabled={clinics.isPending}
                    id="facility"
                    {...register("clinicId")}
                  >
                    <option value="">
                      {clinics.isPending
                        ? "Loading facilities…"
                        : "Select a facility"}
                    </option>
                    {clinics.data?.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                  {errors.clinicId && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.clinicId.message}
                    </p>
                  )}
                  {clinics.isError && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      Could not load facilities. Please refresh the page.
                    </p>
                  )}
                  <p className="mt-1 text-body-sm text-on-surface-variant">
                    Determines default on-premise consultation suite
                  </p>
                </div>
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber="03"
              formInputsSectionTitle="Contact & Clinical Dispatch"
              formInputsSectionDescription="Automated SMS dispatch, emergency paging, and billing receipts"
              headerAdornment={
                <InfoCircleIcon
                  aria-hidden="true"
                  className="h-5 w-5 text-on-surface-variant"
                />
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="email"
                  error={errors.email?.message}
                  label="Official Clinical Email Address"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  placeholder="dr.tamar.b@tbilisiclinic.ge"
                  required
                  type="email"
                  {...register("email")}
                />
                <Input
                  autoComplete="tel-national"
                  error={errors.phone?.message}
                  label="Mobile Phone"
                  leadingElement={
                    <span className="text-label-md text-primary">+995</span>
                  }
                  placeholder="599 44 88 12"
                  required
                  type="tel"
                  {...register("phone")}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  error={errors.emergencyPhone?.message}
                  label="Emergency Dispatch Phone"
                  leadingElement={
                    <span className="text-label-md text-primary">+995</span>
                  }
                  placeholder="599 98 76 54"
                  required
                  type="tel"
                  {...register("emergencyPhone")}
                />
                <div>
                  <label
                    className="mb-1.5 block text-label-md text-on-surface"
                    htmlFor="region"
                  >
                    Region / City
                    <span aria-hidden="true" className="ml-1 text-secondary">
                      *
                    </span>
                  </label>
                  <select
                    aria-invalid={!!errors.city}
                    autoComplete="address-level2"
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    id="region"
                    {...register("city")}
                  >
                    <option>Tbilisi Metropolitan</option>
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
              </div>

              <div className="mt-4">
                <label
                  className="mb-1.5 block text-label-md text-on-surface"
                  htmlFor="bio"
                >
                  Professional Bio
                </label>
                <textarea
                  aria-invalid={!!errors.bio}
                  className="min-h-24 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  id="bio"
                  maxLength={1000}
                  placeholder="e.g. Cardiologist with 8 years of clinical experience."
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="mt-1 text-body-sm text-error" role="alert">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </FormInputsWrapper>

            <FormInputsWrapper
              formInputsSectionNumber="04"
              formInputsSectionTitle="Security & Statutory Practice Consents"
              formInputsSectionDescription="Cryptographic tokens, EHR access keys, and legal disclosures"
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
                  label="Portal & EHR Master Password"
                  leadingElement={<SecurityKeyIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("password")}
                />
                <Input
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  label="Confirm Master Password"
                  leadingElement={<LockIcon className="h-4 w-4" />}
                  required
                  type="password"
                  {...register("confirmPassword")}
                />
              </div>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Must contain at least 10 characters, one number, and one
                symbol.
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                    <input
                      aria-invalid={!!errors.licenseCertification}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      type="checkbox"
                      {...register("licenseCertification")}
                    />
                    <span>
                      I certify under legal penalty and medical board sanctions
                      that my Georgian Ministry of Healthcare (MoH) practicing
                      license is active, unencumbered, and currently valid for
                      diagnostic and clinical prescription execution.
                    </span>
                  </label>
                  {errors.licenseCertification && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.licenseCertification.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                    <input
                      aria-invalid={!!errors.clinicalConsent}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      type="checkbox"
                      {...register("clinicalConsent")}
                    />
                    <span>
                      I consent to automated clinical appointment dispatch,
                      calendar synchronization, and Telehealth WebRTC encrypted
                      recording compliance according to HIPAA/GDPR clinical
                      data protection frameworks.
                    </span>
                  </label>
                  {errors.clinicalConsent && (
                    <p className="mt-1 text-body-sm text-error" role="alert">
                      {errors.clinicalConsent.message}
                    </p>
                  )}
                </div>
              </div>
            </FormInputsWrapper>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Button className="px-5" disabled={isSubmitting} type="submit">
                <PractitionerCalendarIcon
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Submit Practitioner Application &amp; Activate Schedule
              </Button>
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

export default DoctorRegistrationPage;
