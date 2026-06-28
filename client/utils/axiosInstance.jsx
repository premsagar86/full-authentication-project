import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/auth", // auth API base
  withCredentials: true, // send cookies automatically
});

let isRefreshing = false;
let failedQueue = []; // queue requests that failed while refreshing

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // success → pass through

  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh endpoint
        await axiosInstance.post("/refresh-token");

        // New accessToken cookie is now set by the server
        processQueue(null);
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        // Refresh token is also expired/invalid → force logout
        processQueue(refreshError);
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;