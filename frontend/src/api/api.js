import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // deployed backend URL
  withCredentials: true,                 // matches backend
});

export default api;
