const API = "https://wavetrack-backend-rggh.onrender.com/api";

export const register = (data) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMe = (token) =>
  fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const getSongs = (token) =>
  fetch(`${API}/songs`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const createSong = (data, token) =>
  fetch(`${API}/songs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteSong = (id, token) =>
  fetch(`${API}/songs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

export const getStats = (token) =>
  fetch(`${API}/songs/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
