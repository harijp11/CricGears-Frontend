import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 30000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.clearStorage || response.data?.action === 'LOGOUT') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle blocked user
    if (
      error.response?.status === 403 && 
      error.response.data?.message === "user is blocked"
    ) {
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await axiosInstance.post('/refresh-token');
        
        processQueue(null);
        isRefreshing = false;
        
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear storage and redirect to login if refresh fails
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle logout actions
    if (error.response?.data?.clearStorage || error.response?.data?.action === 'LOGOUT') {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;