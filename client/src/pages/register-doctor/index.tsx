import { useState, type FormEvent } from "react";
import { Link } from "react-router";
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
import YearsOfPracticeField from "./components/YearsOfPracticeField";

const genderOptions = ["Male", "Female", "Non-binary", "Undisclosed"];

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setSubmissionMessage(
        "Passwords do not match. Please check both password fields.",
      );
      return;
    }

    setSubmissionMessage(
      "Practitioner registration is not connected to a submission service yet.",
    );
  }

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

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  label="First Name (Legal Given Name)"
                  name="firstName"
                  placeholder="e.g. Tamar"
                  required
                />
                <Input
                  autoComplete="family-name"
                  label="Last Name (Legal Surname)"
                  name="lastName"
                  placeholder="e.g. Beridze"
                  required
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
                  {genderOptions.map((gender, index) => (
                    <label
                      className="cursor-pointer rounded-md px-2 py-2 text-center text-label-md text-on-surface-variant transition-colors has-[:checked]:bg-surface-container-high has-[:checked]:text-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary"
                      key={gender}
                    >
                      <input
                        className="sr-only"
                        defaultChecked={index === 0}
                        name="gender"
                        required={index === 0}
                        type="radio"
                        value={gender}
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  autoComplete="bday"
                  label="Date of Birth"
                  labelAdornment={
                    <span className="text-body-sm text-on-surface-variant">
                      DD/MM/YYYY
                    </span>
                  }
                  name="dateOfBirth"
                  required
                  type="date"
                />
                <Input
                  label="National ID Number (GEO)"
                  labelAdornment={
                    <span className="text-label-md text-secondary">
                      11 Digits
                    </span>
                  }
                  leadingElement={<PatientIdIcon className="h-4 w-4" />}
                  maxLength={11}
                  name="nationalId"
                  pattern="[0-9]{11}"
                  placeholder="01024098412"
                  required
                  title="Enter the 11-digit Georgian national ID number."
                  trailingElement={
                    <span className="rounded-md bg-surface-container-high px-2 py-1 text-label-md text-primary">
                      GEO-ID
                    </span>
                  }
                  inputMode="numeric"
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
                    label="Medical License Number"
                    leadingElement={<LicenseCardIcon className="h-4 w-4" />}
                    name="medicalLicenseNumber"
                    placeholder="GEO-MED-77192-TB"
                    required
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
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    defaultValue={specialtyOptions[0]}
                    id="specialty"
                    name="specialty"
                    required
                  >
                    {specialtyOptions.map((specialty) => (
                      <option key={specialty}>{specialty}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-body-sm text-on-surface-variant">
                    Subspecialties can be configured post-onboarding in EHR
                  </p>
                </div>

                <YearsOfPracticeField />

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
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    defaultValue="Tbilisi Central Clinic (Main Campus)"
                    id="facility"
                    name="facility"
                    required
                  >
                    <option>Tbilisi Central Clinic (Main Campus)</option>
                    <option>University Clinic of Tbilisi</option>
                    <option>Batumi Medical Center</option>
                    <option>Other accredited facility</option>
                  </select>
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
                  label="Official Clinical Email Address"
                  leadingElement={<EmailIcon className="h-4 w-4" />}
                  name="email"
                  placeholder="dr.tamar.b@tbilisiclinic.ge"
                  required
                  type="email"
                />
                <Input
                  autoComplete="tel-national"
                  label="Emergency Dispatch Mobile Phone"
                  leadingElement={
                    <span className="text-label-md text-primary">+995</span>
                  }
                  name="mobilePhone"
                  placeholder="599 44 88 12"
                  required
                  type="tel"
                />
              </div>

              <Input
                autoComplete="street-address"
                className="mt-4"
                label="Clinical Office / Primary Practice Street Address"
                leadingElement={<InfoCircleIcon className="h-4 w-4" />}
                name="streetAddress"
                placeholder="29 Chavchavadze Ave, Building B, Floor 4, Suite 402"
                required
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
                    autoComplete="address-level2"
                    className="min-h-11 w-full rounded-lg bg-surface-lowest px-3 py-2 text-body-md text-on-surface shadow-elevation-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    defaultValue="Tbilisi Metropolitan"
                    id="region"
                    name="region"
                    required
                  >
                    <option>Tbilisi Metropolitan</option>
                    <option>Adjara</option>
                    <option>Imereti</option>
                    <option>Kakheti</option>
                    <option>Other</option>
                  </select>
                </div>
                <Input
                  autoComplete="address-level3"
                  label="District / Municipality"
                  name="district"
                  placeholder="Vake-Saburtalo"
                />
                <Input
                  autoComplete="postal-code"
                  label="Postal Code"
                  name="postalCode"
                  placeholder="0179"
                />
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
                  label="Portal & EHR Master Password"
                  leadingElement={<SecurityKeyIcon className="h-4 w-4" />}
                  name="password"
                  required
                  type="password"
                />
                <Input
                  autoComplete="new-password"
                  label="Confirm Master Password"
                  leadingElement={<LockIcon className="h-4 w-4" />}
                  name="confirmPassword"
                  required
                  type="password"
                />
              </div>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                  <input
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    name="licenseCertification"
                    required
                    type="checkbox"
                  />
                  <span>
                    I certify under legal penalty and medical board sanctions
                    that my Georgian Ministry of Healthcare (MoH) practicing
                    license is active, unencumbered, and currently valid for
                    diagnostic and clinical prescription execution.
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-2 text-body-sm text-on-surface-variant">
                  <input
                    className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                    name="clinicalConsent"
                    required
                    type="checkbox"
                  />
                  <span>
                    I consent to automated clinical appointment dispatch,
                    calendar synchronization, and Telehealth WebRTC encrypted
                    recording compliance according to HIPAA/GDPR clinical data
                    protection frameworks.
                  </span>
                </label>
              </div>
            </FormInputsWrapper>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <Button className="px-5" type="submit">
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
