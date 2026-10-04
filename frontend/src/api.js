import axios from "axios";

const API_URL = "https://ayhh7219e6.execute-api.ap-southeast-2.amazonaws.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const analyzeFloodRisk = async (data) => {
  const response = await api.post("/analyze", data);
  return response.data;
};

export const getLatestData = async () => {
  const response = await api.get("/latest-data");
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;