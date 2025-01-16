import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 30000,
});


axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.clearStorage || response.data?.action === 'LOGOUT') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return response;
  },
  (error) => {
    if (
      error.response?.status === 403 && 
      error.response.data?.message === "user is blocked"
    ) {
      localStorage.clear();
      window.location.href = '/login';
    }
    if (error.response?.data?.clearStorage || error.response?.data?.action === 'LOGOUT') {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;