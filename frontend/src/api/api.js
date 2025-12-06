import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // only use env variable
  withCredentials: true,
});

export default api;
