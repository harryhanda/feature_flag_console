import axiosClient from "./axiosClient";

export async function login(email, password) {
  return axiosClient.post("/auth/login", { email, password });
}

export async function register(email, password, name) {
  return axiosClient.post("/auth/register", { email, password, name });
}

export async function changePassword(oldPassword, newPassword) {
  return axiosClient.put("/auth/change-password", { oldPassword, newPassword });
}

export async function getMe() {
  return axiosClient.get("/auth/me");
}
