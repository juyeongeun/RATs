import { axiosInstance } from "./apiClient";

interface IAdmin {
  id: number;
  name: string;
  email: string;
  password: string;
}

//로그인
const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

//로그아웃
const logout = async () => {
  await axiosInstance.post("/auth/logout");
};

export { login, logout };
