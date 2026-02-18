const rawBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const fallbackBaseUrl = "http://localhost:3000";

export const apiBaseUrl = (rawBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");

export const apiUrl = (path: string) =>
  `${apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
