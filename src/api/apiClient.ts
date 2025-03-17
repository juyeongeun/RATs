import axios, { AxiosError, AxiosInstance } from "axios";

const baseURL = "/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 토큰 만료 에러 (401) 처리
    if (error.response?.status === 401) {
      try {
        await axios.post(
          `${baseURL}/token`,
          {},
          {
            withCredentials: true,
            baseURL,
          }
        );

        if (originalRequest) {
          return axios(originalRequest);
        }
      } catch (refreshError) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
