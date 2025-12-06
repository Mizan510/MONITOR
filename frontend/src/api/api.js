import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://monitor-r0u9.onrender.com/api
  withCredentials: true,
});

export default api;
