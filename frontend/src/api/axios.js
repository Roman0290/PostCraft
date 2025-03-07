import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

// Attach the saved token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is expired/invalid, drop it and tell the app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

/** Pull a human-readable message out of a Laravel error response. */
export function getErrorMessage(error) {
  if (!error.response) return 'Cannot reach the server. Is the Laravel API running?';
  return error.response.data?.message || 'Something went wrong.';
}

/** Laravel validation errors: { field: ["message"] } -> { field: "message" } */
export function getFieldErrors(error) {
  const errors = error.response?.data?.errors || {};
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]]));
}

export default api;
