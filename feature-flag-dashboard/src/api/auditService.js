import axiosClient from "./axiosClient";

export const getAuditLogs = (filters = {}) =>
  axiosClient.get("/audit", { params: filters });
