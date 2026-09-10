import axios from "axios";

// One shared axios instance for the whole app.
// Every file in this folder (auth.js, trips.js, ...) imports this
// instead of creating its own axios instance.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
});

// REQUEST interceptor: runs before every request is sent.
// If we have a saved token, attach it as "Authorization: Bearer <token>"
// so protected backend routes accept the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;