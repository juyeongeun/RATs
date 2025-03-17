import { axiosInstance } from "./apiClient";

const PATH = "/token";

const refreshAccessToken = async () => {
  const response = await axiosInstance.post(`${PATH}`);
  return response.data;
};

export default refreshAccessToken;
