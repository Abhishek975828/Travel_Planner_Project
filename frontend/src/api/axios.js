import axios from "axios";

// One shared axios instance for the whole app.
// API requests will automatically use the /api prefix.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// REQUEST interceptor
// Attach JWT token to protected requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE interceptor
// If token is invalid/expired, remove saved login data.
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
