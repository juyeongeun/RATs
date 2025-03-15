import employeeRepository from "../repository/employeeRepository";

const getEmployees = async (
  adminId: number,
  cursor?: number,
  limit?: number,
  keyword?: string
) => {
  return employeeRepository.getEmployees(adminId, cursor, limit, keyword);
};

const createEmployee = async (
  adminId: number,
  name: string,
  macAddress: string
) => {
  return employeeRepository.createEmployee(adminId, name, macAddress);
};

const deleteEmployee = async (adminId: number, employeeId: number) => {
  return employeeRepository.deleteEmployee(adminId, employeeId);
};

export default {
  getEmployees,
  createEmployee,
  deleteEmployee,
};
