import { axiosInstance } from "./apiClient";

const PATH = "/admin";

//로그인
const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(`${PATH}/login`, {
    email,
    password,
  });

  return response.data;
};

//로그아웃
const logout = async () => {
  await axiosInstance.post(`${PATH}/logout`);
};

// 회원가입
const signup = async (email: string, password: string) => {
  await axiosInstance.post(`${PATH}/signup`, {
    email,
    password,
  });
};

export { login, logout, signup };
