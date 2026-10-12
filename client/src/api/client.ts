// TODO: move to an env variable (import.meta.env.VITE_API_URL)
export const BASE_URL = "http://localhost:5000/";

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

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as TResponse;
}
