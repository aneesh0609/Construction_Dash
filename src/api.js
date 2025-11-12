import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  withCredentials: true // VERY IMPORTANT for cookie auth
});

export default API;
