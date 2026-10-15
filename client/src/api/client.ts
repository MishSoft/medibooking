import { authStorage } from "./auth.storage";

// TODO: move to an env variable (import.meta.env.VITE_API_URL)
export const BASE_URL = "http://localhost:5000/";

const SIGN_IN_PATH = "/path-selector";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<TResponse>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<TResponse> {
  const url = new URL(path.replace(/^\//, ""), BASE_URL);
  const token = authStorage.getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  // Expired or invalid session — drop it and send the user back to sign in
  if (response.status === 401 && token) {
    authStorage.clear();
    window.location.assign(SIGN_IN_PATH);
  }

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}
