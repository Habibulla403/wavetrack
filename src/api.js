const API = "https://wavetrack-backend-rggh.onrender.com/api";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// ── Auth ──────────────────────────────────────────────────────────
export const register = (data) =>
  fetch(`${API}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMe = (token) =>
  fetch(`${API}/auth/me`, { headers: authHeaders(token) }).then((r) => r.json());

export const updateProfile = (data, token) =>
  fetch(`${API}/auth/profile`, {
    method: "PUT", headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

// ── Songs ─────────────────────────────────────────────────────────
export const getSongs = (token) =>
  fetch(`${API}/songs`, { headers: authHeaders(token) }).then((r) => r.json());

export const createSong = (data, token) =>
  fetch(`${API}/songs`, {
    method: "POST", headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateSong = (id, data, token) =>
  fetch(`${API}/songs/${id}`, {
    method: "PUT", headers: authHeaders(token),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteSong = (id, token) =>
  fetch(`${API}/songs/${id}`, {
    method: "DELETE", headers: authHeaders(token),
  }).then((r) => r.json());

// ── Stats & Analytics ─────────────────────────────────────────────
export const getStats = (token) =>
  fetch(`${API}/songs/stats`, { headers: authHeaders(token) }).then((r) => r.json());

export const getAnalytics = (token) =>
  fetch(`${API}/songs/analytics`, { headers: authHeaders(token) }).then((r) => r.json());
