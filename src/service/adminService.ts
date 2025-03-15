import adminRepository from "../repository/adminRepository";
import { Admin } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomAdmin {
  id: number;
  email: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const filterSensitiveUserData = (user: Admin) => {
  //리스폰스의 민감한 정보를 빼고 보낸다
  const { password, refreshToken, ...rest } = user;
  return rest;
};

const createToken = (admin: CustomAdmin, type: "access" | "refresh") => {
  const payload = {
    id: admin.id,
    email: admin.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: type === "refresh" ? "7d" : "1h",
  });
};

const adminSignup = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { admin } = await adminRepository.createAdmin(email, hashedPassword);
  return { admin: filterSensitiveUserData(admin) };
};

const adminLogin = async (email: string, password: string) => {
  const { admin } = await adminRepository.getAdminByEmail(email);

  if (!admin) {
    throw new Error("Admin not found");
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = createToken(admin, "access");
  const refreshToken = createToken(admin, "refresh");

  const { admin: updatedAdmin } = await adminRepository.updateAdmin(admin.id, {
    refreshToken,
    accessToken,
  });

  return {
    admin: {
      ...filterSensitiveUserData(updatedAdmin),
      accessToken,
    },
    accessToken,
    refreshToken,
  };
};

const updateAdmin = async (id: number, data: Partial<Admin>) => {
  const { admin } = await adminRepository.updateAdmin(id, data);
  return filterSensitiveUserData(admin);
};

const getAdminById = async (id: number) => {
  const { admin } = await adminRepository.getAdminById(id);
  if (!admin) {
    throw new Error("Admin not found");
  }
  return admin;
};

export default {
  adminSignup,
  adminLogin,
  createToken,
  updateAdmin,
  getAdminById,
};
