import apiClient from "./apiClient";

const PATH = "/packet";

export const getPacketList = async (employeeId: number, date?: string) => {
  const dateString = date ? date : new Date().toISOString().split("T")[0];
  const response = await apiClient.get(
    `${PATH}/${employeeId}?date=${dateString}`
  );
  return response.data;
};

export const getPacketMonthList = async (employeeId: number, date?: string) => {
  const yearString = date ? date.split("-")[0] : new Date().getFullYear();
  const monthString = date ? date.split("-")[1] : new Date().getMonth();
  const response = await apiClient.get(
    `${PATH}/${employeeId}?year=${yearString}&month=${monthString}`
  );
  return response.data;
};
