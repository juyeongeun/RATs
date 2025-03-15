import { Admin } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      admin?: Admin;
    }

    interface User extends Admin {}
  }
}
