import axios, { AxiosError, AxiosInstance } from "axios";
import Modal from "@/components/modal/Modal";

const baseURL = "/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
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
    console.error(
      "응답 오류:",
      error.message,
      error.response?.status,
      error.config?.url
    );

    const originalRequest = error.config;

    // 토큰 만료 에러 (401) 처리
    if (error.response?.status === 401) {
      try {
        await axios.post(
          `${baseURL}/token`,
          {},
          {
            withCredentials: true,
          }
        );

        if (originalRequest) {
          return axios(originalRequest);
        }
      } catch (refreshError) {
        Modal({
          message: "세션이 만료되었습니다. 다시 로그인해주세요.",
          title: "세션 만료",
        });
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
