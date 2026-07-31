/**
 * AgriSphere AI — Axios Client
 * Single instance shared by all API modules.
 * - Attaches JWT from localStorage on every request
 * - Unwraps the { success, data, message } response envelope
 * - Handles 401 (token expired) globally
 */
import axios from 'axios';
import { getStoredToken, clearStorage } from '@utils/storage';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: attach JWT ──
client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: unwrap envelope + handle errors ──
client.interceptors.response.use(
  (response) => {
    // Backend returns { success, message, data, errors, timestamp }
    // Unwrap so all API functions receive clean payloads
    const body = response.data;
    if (body && 'data' in body) return body.data;
    return body;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear session, redirect to login
      clearStorage();
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Network error';
    return Promise.reject(new Error(message));
  }
);

export default client;
