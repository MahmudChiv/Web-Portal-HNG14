const DEFAULT_PRODUCTION_API_BASE_URL = null;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? DEFAULT_PRODUCTION_API_BASE_URL : "/api");
