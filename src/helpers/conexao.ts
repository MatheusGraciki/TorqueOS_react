import axios from "axios";

// if an API URL is provided through env we use it, otherwise default to
// an empty string so axios makes requests relative to the current origin.
// that allows us to configure a dev server proxy and avoid CORS errors.
function resolveApiBaseURL(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

  if (!raw) {
    return "/api";
  }

  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
    return raw;
  }

  // Accept host/path values and force absolute https URL.
  return `https://${raw}`;
}

const baseURL = resolveApiBaseURL();

const instance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function cancel() {
  return new AbortController();
}

// internal helper to run a request with optional body and method
export function conexao(url: string, data: any, metodo: string) {
  const controller = new AbortController();
  const promise = instance.request({
    url,
    method: metodo as any,
    data,
    signal: controller.signal,
  });
  return [promise, controller] as [Promise<any>, AbortController];
}

export function get(url: string, data?: any) {
  return instance.get(url, { params: data });
}

export function post(url: string, ...args: any[]) {
  return instance.post(url, ...args);
}

export function put(url: string, data: any) {
  return instance.put(url, data);
}

export function delet(url: string, data?: any) {
  return instance.delete(url, { data });
}

export function getC(url: string, data?: any) {
  const [p, controller] = conexao(url, data, "GET");
  return [p, controller] as [Promise<any>, AbortController];
}

export function postC(url: string, ...args: any[]) {
  const controller = new AbortController();
  const promise = instance.post(url, ...args, { signal: controller.signal } as any);
  return [promise, controller] as [Promise<any>, AbortController];
}
