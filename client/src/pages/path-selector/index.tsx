import { useState } from "react";
import { useLocation } from "react-router";
import PatientRegistration from "../../components/auth/PatientRegistration";
import PatientSignIn from "../../components/auth/PatientSignIn";
import DoctorSignIn from "../../components/auth/DoctorSignIn";
import ClinicRegistration from "../../components/auth/ClinicRegistration";
import ClinicSignIn from "../../components/auth/ClinicSignIn";

function PathSelectorPage() {
  const location = useLocation();
  const shouldShowPatientSignIn =
    typeof location.state === "object" &&
    location.state !== null &&
    "showPatientSignIn" in location.state &&
    location.state.showPatientSignIn === true;
  const shouldShowClinicSignIn =
    typeof location.state === "object" &&
    location.state !== null &&
    "showClinicSignIn" in location.state &&
    location.state.showClinicSignIn === true;
  const [showPatientSignIn, setShowPatientSignIn] = useState(
    shouldShowPatientSignIn,
  );
  const [showClinicSignIn, setShowClinicSignIn] = useState(
    shouldShowClinicSignIn,
  );

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060E20] max-[1300px]:flex max-[1300px]:h-dvh max-[1300px]:min-h-0 max-[1300px]:flex-col">
      <div
        className="relative z-[9] h-screen w-screen -translate-x-1/2 skew-x-[-15deg]
         bg-[linear-gradient(90deg,#071913_0%,#0B1326_50%,#0A1B24_100%)]
         after:absolute after:right-0 after:top-0 after:h-full after:w-[1px]
         after:bg-[repeating-linear-gradient(to_bottom,#4EDEA3_0_4px,transparent_4px_6px)]
         max-[1300px]:h-1/2 max-[1300px]:w-full max-[1300px]:translate-none max-[1300px]:transform-none
         max-[1300px]:after:top-auto max-[1300px]:after:bottom-0 max-[1300px]:after:h-px max-[1300px]:after:w-full
         max-[1300px]:after:bg-[repeating-linear-gradient(to_right,#4EDEA3_0_4px,transparent_4px_6px)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[52%] top-[8%] h-105 w-105 skew-x-15 rounded-full bg-[#1F5C3F]/50 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6%] left-[75%] h-90 w-90 skew-x-15 rounded-full bg-[#0E4A4A]/40 blur-[90px]"
        />
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 left-[58%] w-28 skew-x-[15deg] sm:w-36 lg:w-40 max-[1300px]:transform-none"
          src="/assets/icons/charty-line.svg"
        />
        <section className="absolute inset-0 flex items-center justify-end px-6 py-5 sm:px-10 lg:pr-[calc(7vw+100px)] lg:pl-[7vw] max-[1300px]:justify-center max-[1300px]:overflow-hidden max-[1300px]:px-6 max-[1300px]:pt-8 max-[1300px]:pb-3">
          <div
            className="path-selector-content path-selector-content--top w-full max-w-[560px] skew-x-[15deg]
             max-[1300px]:grid max-[1300px]:max-w-[1168px] max-[1300px]:grid-cols-2 max-[1300px]:items-start
             max-[1300px]:gap-x-12 max-[1300px]:transform-none max-[1300px]:*:min-w-0"
          >
            {showPatientSignIn ? (
              <PatientSignIn
                onRegisterClick={() => setShowPatientSignIn(false)}
              />
            ) : (
              <PatientRegistration
                onSignInClick={() => setShowPatientSignIn(true)}
              />
            )}

            <DoctorSignIn />
          </div>
        </section>
      </div>
      <div className="absolute inset-0 -z-[9] overflow-hidden max-[1300px]:relative max-[1300px]:inset-auto max-[1300px]:h-1/2 bg-[linear-gradient(105deg,#03151F_0%,#09152B_50%,#060E20_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[50%] top-[30%] h-100 w-75 rounded-full bg-[#0A2A4A]/50 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-10%] right-[5%] h-130 w-130 rounded-full bg-[#164A5A]/45 blur-[100px]"
        />
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 w-48 sm:w-64 lg:w-80"
          src="/assets/icons/building-shape.svg"
        />
        <section className="flex min-h-screen items-center justify-end px-6 py-5 sm:px-10 lg:px-[7vw] max-[1300px]:h-full max-[1300px]:min-h-0 max-[1300px]:justify-center max-[1300px]:overflow-hidden max-[1300px]:px-6 max-[1300px]:pt-3 max-[1300px]:pb-8">
          <div className="path-selector-content path-selector-content--bottom w-full max-w-[520px] max-[1300px]:*:ml-0">
            {showClinicSignIn ? (
              <ClinicSignIn
                onRegisterClick={() => setShowClinicSignIn(false)}
              />
            ) : (
              <ClinicRegistration
                onSignInClick={() => setShowClinicSignIn(true)}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PathSelectorPage;
