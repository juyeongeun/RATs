import prismaClient from "../util/prismaClient";

const getEmployees = async (
  adminId: number,
  cursor?: number,
  limit: number = 12,
  keyword?: string
) => {
  const employees = await prismaClient.employee.findMany({
    where: { adminId, name: { contains: keyword, mode: "insensitive" } },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit,
    orderBy: { id: "asc" },
  });

  const nextCursor =
    employees.length > 0 ? employees[employees.length - 1].id : null;

  return {
    employees,
    nextCursor,
    hasMore: employees.length === limit,
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
