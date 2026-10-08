import { useState } from "react";
import PatientRegistration from "../../components/auth/PatientRegistration";
import PatientSignIn from "../../components/auth/PatientSignIn";
import DoctorSignIn from "../../components/auth/DoctorSignIn";
import ClinicRegistration from "../../components/auth/ClinicRegistration";
import ClinicSignIn from "../../components/auth/ClinicSignIn";

function PathSelectorPage() {
  const [showPatientSignIn, setShowPatientSignIn] = useState(false);
  const [showClinicSignIn, setShowClinicSignIn] = useState(false);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060E20]">
      <div
        className="relative z-[9] h-screen w-screen -translate-x-1/2 skew-x-[-15deg]
         bg-[linear-gradient(90deg,#071913_0%,#0B1326_50%,#0A1B24_100%)]
         after:absolute after:right-0 after:top-0 after:h-full after:w-[1px]
         after:bg-[repeating-linear-gradient(to_bottom,#4EDEA3_0_4px,transparent_4px_6px)]"
      >
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 left-[58%] w-28 skew-x-[15deg] sm:w-36 lg:w-40"
          src="/assets/icons/charty-line.svg"
        />
        <section className="absolute inset-0 flex items-center justify-end px-6 py-5 sm:px-10 lg:pr-[calc(7vw+100px)] lg:pl-[7vw]">
          <div className="w-full max-w-[560px] skew-x-[15deg]">
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
      <div className="absolute inset-0 -z-[9] overflow-hidden bg-[linear-gradient(105deg,#03151F_0%,#09152B_50%,#060E20_100%)]">
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 w-48 sm:w-64 lg:w-80"
          src="/assets/icons/building-shape.svg"
        />
        <section className="flex min-h-screen items-center justify-end px-6 py-5 sm:px-10 lg:px-[7vw]">
          <div className="w-full max-w-[520px]">
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
