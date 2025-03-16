import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAdminById = async (id: number) => {
  return await prisma.admin.findUnique({
    where: { id },
  });
};

const updateAccessToken = async (id: number, accessToken: string) => {
  return await prisma.admin.update({
    where: { id },
    data: { accessToken },
  });
};

export default { getAdminById, updateAccessToken };
