import employeeRepository from "../repository/employeeRepository";

const getEmployees = async (adminId: number, keyword?: string) => {
  return employeeRepository.getEmployees(adminId, keyword);
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
