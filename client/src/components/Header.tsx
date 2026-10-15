import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { authStorage } from "../api/auth.storage";
import { PractitionerSignInIcon } from "../assets/icons/Icons";

type HeaderProps = {
  role?: string;
};

function Header({ role = "Patient" }: HeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isSignedIn = !!authStorage.getToken();

  const handleSignOut = () => {
    authStorage.clear();
    // Drop cached data so the next user never sees the previous one's records
    queryClient.clear();
    navigate("/path-selector", { replace: true });
  };

  return (
    <header
      aria-label="MediBooking"
      className="flex min-h-24 w-full items-center justify-between bg-surface-lowest px-5 sm:px-8 lg:px-12"
    >
      <span className="font-inter text-headline-sm font-semibold text-on-surface">
        MediBooking
      </span>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface">
          <span className="text-primary">ROLE</span>
          {role}
        </span>
        <span className="rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface-variant">
          EN
        </span>
        {isSignedIn && (
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-surface-container-high bg-surface-container-low px-2 py-1 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={handleSignOut}
            type="button"
          >
            <PractitionerSignInIcon
              aria-hidden="true"
              className="h-3.5 w-3.5 rotate-180"
            />
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
