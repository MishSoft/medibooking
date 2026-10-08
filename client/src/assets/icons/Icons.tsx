import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PatientProfileIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
      />
    </svg>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.2 1.4 2.6-.2 1.2 2.3 2.3 1.2-.2 2.6L21.5 12l-1.4 2.2.2 2.6-2.3 1.2-1.2 2.3-2.6-.2L12 21.5l-2.2-1.4-2.6.2L6 18l-2.3-1.2.2-2.6L2.5 12l1.4-2.2-.2-2.6L6 6l1.2-2.3 2.6.2L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  );
}

export function RecordsFolderIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7.5h6l2 2h8v9H4v-11Zm0 0V5.5h6l2 2m-4 5h8"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

export function PractitionerCalendarIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 4v3m10-3v3M5 9h14M6 6h12a2 2 0 0 1 2 2v11H4V8a2 2 0 0 1 2-2Zm4 6 2 2 4-4"
      />
    </svg>
  );
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 11v5m0-8h.01"
      />
    </svg>
  );
}

export function LicenseCardIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 5h14v14H5zM8 9h8m-8 4h5"
      />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path strokeLinecap="round" d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function PatientIdIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="1.75" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 15.5c.7-1.2 1.5-1.75 2.5-1.75s1.8.55 2.5 1.75M14 10h3.5m-3.5 3h3.5"
      />
    </svg>
  );
}

export function FaceBiometricIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 15c1.5-2 6.5-2 8 0M9 9h.01M15 9h.01"
      />
    </svg>
  );
}

export function PractitionerSignInIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 17l5-5-5-5m5 5H3m18-8v16"
      />
    </svg>
  );
}

export function ClinicBuildingIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h16.5v13.5H3.75zM7.5 8.25h3v3h-3zM13.5 8.25h3m-3 3h3M7.5 14.25h3m3 0h3"
      />
    </svg>
  );
}

export function ClinicNetworkIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      {...props}
    >
      <circle cx="12" cy="12" r="2" />
      <circle cx="5" cy="7" r="1.5" />
      <circle cx="19" cy="7" r="1.5" />
      <circle cx="5" cy="17" r="1.5" />
      <circle cx="19" cy="17" r="1.5" />
      <path
        strokeLinecap="round"
        d="m10.4 11.1-4-3m7.2 2 4-3m-7.2 5.8-4 3m7.2-2 4 3"
      />
    </svg>
  );
}

export function CheckmarkIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 10 3 3 7-7"
      />
    </svg>
  );
}

export function ClinicCalendarIcon(props: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h16.5v13.5H3.75zM8 8.25v3m8-3v3M7.5 18.75v-3h3v3m2-7.5h3m-3 3h3"
      />
    </svg>
  );
}
