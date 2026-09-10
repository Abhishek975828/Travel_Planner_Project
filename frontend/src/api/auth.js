import api from "./axios";

// Each function here just wraps one backend endpoint so pages/context
// never have to write axios calls or URLs directly.

// POST /auth/register -> { _id, name, email, token }
export const registerUser = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

// POST /auth/login -> { _id, name, email, token }
export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

// GET /auth/me -> { _id, name, email } (protected)
export const getMe = () => api.get("/auth/me");