import { toast } from "sonner";

export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") =>
  error instanceof Error && error.message ? error.message : fallback;

export const notify = {
  success: (title: string, description?: string) => toast.success(title, { description }),
  info: (title: string, description?: string) => toast.info(title, { description }),
  error: (error: unknown, fallback?: string) => toast.error(getErrorMessage(error, fallback)),
};
