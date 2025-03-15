import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import adminService from "../service/adminService";
import cookiesConfig from "../config/cookiesConfig";
import asyncHandle from "../util/error/asyncHandle";
import passport from "../config/passportConfig";
import { CustomAdmin } from "../types/express";
const router = Router();

router.post(
  "/signup",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const admin = await adminService.adminSignup(email, password);
      res.status(201).json(admin);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/login",
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const { admin, accessToken, refreshToken } =
        await adminService.adminLogin(email, password);

      res.cookie("access-token", accessToken, cookiesConfig.accessTokenOption);
      res.cookie(
        "refresh-token",
        refreshToken,
        cookiesConfig.refreshTokenOption
      );

      res.status(200).json(admin);
    } catch (error) {
      next(error);
    }
  })
);

router.post(
  "/logout",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new Error("인증되지 않은 사용자입니다.");
    }

    const user = req.user as CustomAdmin;
    const userId = user.id;

    await adminService.updateAdmin(userId, {
      refreshToken: "",
    });

    res.cookie("access-token", null, cookiesConfig.clearAccessTokenOption);
    res.cookie("refresh-token", null, cookiesConfig.clearRefreshTokenOption);
    res.status(200).json({ message: "로그아웃 성공" });
  })
);

export default router;
