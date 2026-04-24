import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Only hard-redirect on 401 for non-auth endpoints
    // The /auth/me check handles its own 401 gracefully in AuthContext
    const url = err.config?.url || "";
    if (err.response?.status === 401 && !url.includes("/auth/")) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
