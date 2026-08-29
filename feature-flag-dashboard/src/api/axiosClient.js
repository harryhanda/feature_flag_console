import axios from "axios";

// Single source of truth for the backend base URL. Create React App only
// exposes env vars prefixed with REACT_APP_ to the browser bundle.
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every request. AuthContext also sets
// axios.defaults.headers.common, but keeping this on the instance means
// featureService/userService/auditService work correctly even if someone
// imports them before AuthContext has mounted.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so callers can always do `err.message` and get the
// backend's actual message instead of a generic "Request failed with
// status code 401".
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const backendMessage = err.response?.data?.message;
    if (backendMessage) {
      err.message = backendMessage;
    } else if (err.request && !err.response) {
      err.message = "Could not reach the server. Please try again.";
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
