import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${BASE_URL}/api` : "/api",
  withCredentials: true,
});
