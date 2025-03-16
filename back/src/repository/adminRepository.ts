import prismaClient from "../util/prismaClient";
import { Admin } from "@prisma/client";

const createAdmin = async (email: string, password: string) => {
  const admin = await prismaClient.admin.create({
    data: { email, password },
  });

  return { message: "회원가입 성공", admin };
};

const getAdminByEmail = async (email: string) => {
  const admin = await prismaClient.admin.findUnique({ where: { email } });
  return { admin };
};

const updateAdmin = async (id: number, data: Partial<Admin>) => {
  const admin = await prismaClient.admin.update({ where: { id }, data });
  return { message: "업데이트 성공", admin };
};

const getAdminById = async (id: number) => {
  const admin = await prismaClient.admin.findUnique({ where: { id } });
  return { message: "조회 성공", admin };
};

export default { createAdmin, getAdminByEmail, updateAdmin, getAdminById };
