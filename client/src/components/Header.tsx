import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { authStorage } from "../api/auth.storage";
import { CloseIcon, PractitionerSignInIcon } from "../assets/icons/Icons";
import { Role } from "../types/enums";
import { notify } from "../utils/notify";

const roleLabels: Record<Role, string> = {
  [Role.PATIENT]: "Patient",
  [Role.DOCTOR]: "Doctor",
  [Role.CLINIC_ADMIN]: "Clinic",
};

type HeaderProps = {
  role?: string;
};

function Header({ role = "Patient" }: HeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isSignedIn = !!authStorage.getToken();
  const user = isSignedIn ? authStorage.getUser() : null;
  // Badge is hidden for signed-out visitors
  const roleLabel = isSignedIn
    ? (user?.role && roleLabels[user.role]) || role
    : null;
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    // Revoke the token on the server; sign out locally even if this fails
    await authApi.logout().catch(() => undefined);
    authStorage.clear();
    // Drop cached data so the next user never sees the previous one's records
    queryClient.clear();
    notify.info("You have been signed out");
    navigate("/path-selector", { replace: true });
  };

  return (
    <header
      aria-label="MediBooking"
      className="flex min-h-24 w-full items-center justify-between bg-surface-lowest px-5 sm:px-8 lg:px-12"
    >
      <span className="font-inter text-headline-sm font-semibold text-on-surface">
        MediBooking | One Hub for Patients, Doctors & Clinics
      </span>

      <div className="flex items-center gap-2">
        {roleLabel && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface">
            <span className="text-primary">ROLE</span>
            {roleLabel}
          </span>
        )}
        <span className="rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface-variant">
          EN
        </span>
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label="Open profile menu"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary-container text-label-lg font-semibold text-on-primary-container transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIsMenuOpen((open) => !open)}
              type="button"
            >
              {initials}
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-surface-container-high bg-surface-container p-2 shadow-elevation-3"
                role="menu"
              >
                <div className="flex items-start gap-2 py-2 pl-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-md font-semibold text-on-surface">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-body-sm text-on-surface-variant">
                      {user.email}
                    </p>
                  </div>
                  <button
                    aria-label="Close profile menu"
                    className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setIsMenuOpen(false)}
                    type="button"
                  >
                    <CloseIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="my-1 h-px bg-surface-container-high" />
                <button
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={handleSignOut}
                  role="menuitem"
                  type="button"
                >
                  <PractitionerSignInIcon
                    aria-hidden="true"
                    className="h-3.5 w-3.5 rotate-180"
                  />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
