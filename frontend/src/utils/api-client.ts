const defaultApiBaseUrl = "http://localhost:5000";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || defaultApiBaseUrl).replace(/\/$/, "");

export const buildApiUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
