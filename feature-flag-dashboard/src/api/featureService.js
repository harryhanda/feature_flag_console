import axios from "axios";

const API_URL = "http://localhost:5001/api/features"; // ✅ matches your backend port

export const getFeatures = async () => axios.get(API_URL);
export const addFeature = async (feature) => axios.post(API_URL, feature);
export const updateFeature = async (id, updatedFeature) =>
  axios.put(`${API_URL}/${id}`, updatedFeature);
export const deleteFeature = async (id) => axios.delete(`${API_URL}/${id}`);
