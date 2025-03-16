import { Router } from "express";
import packetService from "../service/packetService";
import asyncHandle from "../util/error/asyncHandle";
import passport from "../config/passportConfig";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.get(
  "/:employeeId",
  passport.authenticate("access-token", { session: false }),
  asyncHandle(async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 5;

    // 특정 날짜만 조회하는 경우
    const date = req.query.date as string | undefined;

    // 월별 조회
    const year = req.query.year ? Number(req.query.year) : undefined;
    const month = req.query.month ? Number(req.query.month) : undefined;

    let packets;

    if (date) {
      // 특정 날짜 조회
      packets = await packetService.getPacketsByDate(
        Number(employeeId),
        date,
        cursor,
        limit
      );
    } else if (year && month) {
      // 월별 조회
      packets = await packetService.getPacketsByMonth(
        Number(employeeId),
        year,
        month
      );
    }

    res.status(200).json(packets);
  })
);

export default router;
