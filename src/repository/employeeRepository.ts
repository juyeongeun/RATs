import prismaClient from "../util/prismaClient";

const getEmployees = async (adminId: number, keyword?: string) => {
  const employees = await prismaClient.employee.findMany({
    where: { adminId, name: { contains: keyword, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
  return {
    employees,
  };
};

const createEmployee = async (
  adminId: number,
  name: string,
  macAddress: string
) => {
  const employee = await prismaClient.employee.create({
    data: {
      name,
      macAddress,
      adminId,
    },
  });
  return employee;
};

const deleteEmployee = async (adminId: number, employeeId: number) => {
  return prismaClient.employee.delete({
    where: { id: employeeId, adminId },
  });
};

export default {
  getEmployees,
  createEmployee,
  deleteEmployee,
};
