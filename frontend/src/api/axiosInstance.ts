import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("galaxy_auth_token");
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.error("ACCESS DENIED: Unauthorized. Redirecting to auth gateway.");
        localStorage.removeItem("galaxy_auth_token");
      }
      
      if (status === 403) {
        console.error("ACCESS DENIED: Insufficient clearances for this operation.");
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;