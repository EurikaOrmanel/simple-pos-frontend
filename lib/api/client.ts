export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:1879";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "APIError";
  }
}

export interface RequestOptions<T = unknown> {
  method?: string;
  headers?: Record<string, string>;
  body?: T;
  token?: string;
}

export async function apiRequest<T, B = unknown>(
  endpoint: string,
  options: RequestOptions<B> = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, token } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `${token}`;
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new APIError(
      data.message || "An error occurred",
      response.status,
      data
    );
  }

  return data;
}

export async function uploadFile(
  file: File,
  token?: string
): Promise<{ image: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const requestHeaders: Record<string, string> = {};

  if (token) {
    requestHeaders.Authorization = `${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/v1/admins/products/upload`, {
    method: "POST",
    headers: requestHeaders,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(
      data.message || "Failed to upload file",
      response.status,
      data
    );
  }

  return data;
}
