import { axiosInstance } from "./apiClient";

//GET /employee →res.user

const PATH = "/employee";

// 직원 목록 가져오기 (페이지네이션 지원)
const getEmployee = async (keyword?: string) => {
  try {
    const url = keyword ? `${PATH}?keyword=${keyword}` : `${PATH}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("직원 목록 가져오기 실패:", error);
    throw error;
  }
};

const postEmployee = async (data: any) => {
  const response = await axiosInstance.post(PATH, data);
  return response.data;
};

const deleteEmployee = async (id: number) => {
  await axiosInstance.delete(`${PATH}/${id}`);
};

export { getEmployee, postEmployee, deleteEmployee };
