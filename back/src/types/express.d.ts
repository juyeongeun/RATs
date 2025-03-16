import { Admin } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }

    interface User extends Admin {}
  }
}

export interface CustomAdmin {
  id: number;
  email: string;
  password: string;
  accessToken: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}
