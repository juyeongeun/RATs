import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import asyncHandle from "../util/error/asyncHandle";
import passport from "../config/passportConfig";
import tokenService from "../service/tokenService";
import cookiesConfig from "../config/cookiesConfig";
const router = Router();

router.post(
  "/",
  passport.authenticate("refresh-token", { session: false }),
  asyncHandle(async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user || !user.id || !user.refreshToken) {
        return res
          .status(401)
          .json({ message: "인증 정보가 유효하지 않습니다." });
      }

      const tokenData = await tokenService.refreshToken(
        user.id,
        user.refreshToken
      );

      res.cookie(
        "access-token",
        tokenData.accessToken,
        cookiesConfig.accessTokenOption
      );

      return res.status(200).json({
        message: "토큰이 성공적으로 갱신되었습니다.",
        user: tokenData.user,
      });
    } catch (error: any) {
      if (error.status) {
        return res
          .status(error.status)
          .json(error.data || { message: error.message });
      }
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  })
);

export default router;
