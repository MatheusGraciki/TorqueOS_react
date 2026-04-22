// simple wrapper around fetch for our generic API endpoints.

function resolveApiBaseURL(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

  if (!raw) {
    return "/api";
  }

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw.replace(/\/$/, "");
  }

  return `https://${raw}`.replace(/\/$/, "");
}

const API_BASE_URL = resolveApiBaseURL();

function buildUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildUrl(path), {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data: any) => request<T>(path, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(path: string, data: any) => request<T>(path, { method: "PUT", body: JSON.stringify(data) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
