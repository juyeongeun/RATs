import { Router } from "express";
import employeeService from "../service/employeeService";
import { Request, Response, NextFunction } from "express";
import asyncHandle from "../util/error/asyncHandle";
import passport from "../config/passportConfig";
import { CustomAdmin } from "../types/express";

const router = Router();

router.get(
  "/",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { id: adminId } = req.user as CustomAdmin;
    const keyword = req.query.keyword ? String(req.query.keyword) : undefined;

    const { employees } = await employeeService.getEmployees(adminId, keyword);

    res.status(200).json({
      employees,
    });
  })
);

router.post(
  "/",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { id: adminId } = req.user as CustomAdmin;
    const { name, macAddress } = req.body;

    const employee = await employeeService.createEmployee(
      adminId,
      name,
      macAddress
    );
    res.status(201).json(employee);
  })
);

router.delete(
  "/:employeeId",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { id: adminId } = req.user as CustomAdmin;
    const { employeeId } = req.params;

    await employeeService.deleteEmployee(adminId, Number(employeeId));
    res.status(200).json({ message: "사원 삭제 성공" });
  })
);

export default router;
