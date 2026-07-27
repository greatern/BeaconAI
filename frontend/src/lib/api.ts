import axios from "axios";

export const TOKEN_STORAGE_KEY = "beacon_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    return Promise.reject(error);
  },
);

/** Resolves an /uploads/... path returned by the API into a full URL. */
export function resolveMediaUrl(path: string | null | undefined) {
  if (!path) return null;

  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  return `${base}${path}`;
}
