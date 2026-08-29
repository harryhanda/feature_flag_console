import axiosClient from "./axiosClient";

export const getFeatures = () => axiosClient.get("/features");
export const addFeature = (feature) => axiosClient.post("/features", feature);
export const updateFeature = (id, updatedFeature) =>
  axiosClient.put(`/features/${id}`, updatedFeature);
export const deleteFeature = (id) => axiosClient.delete(`/features/${id}`);
