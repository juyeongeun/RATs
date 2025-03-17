import moment from "moment";
import fs from "fs";
import path from "path";
import csvWriter from "csv-write-stream";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ArchivePeriod = "first-half" | "second-half";

// 패킷 데이터 아카이빙 함수
async function archivePacketData(
  period: ArchivePeriod,
  adminId: number
): Promise<void> {
  let startDate: Date, endDate: Date, periodLabel: string;
  const currentYear = moment().year();

  if (period === "first-half") {
    // 1~6월 데이터
    startDate = new Date(`${currentYear}-01-01`);
    endDate = new Date(`${currentYear}-06-30`);
    periodLabel = "1_6";
  } else {
    // 7~12월 데이터
    startDate = new Date(`${currentYear}-07-01`);
    endDate = new Date(`${currentYear}-12-31`);
    periodLabel = "7_12";
  }

  try {
    // Prisma를 사용하여 데이터 조회
    const packets = await prisma.packet.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        employee: {
          adminId: adminId,
        },
      },
    });

    if (packets.length === 0) {
      console.log("아카이빙할 데이터가 없습니다.");
      return;
    }

    // archives 디렉토리가 없으면 생성
    const archiveDir = path.join(__dirname, "../../archives");
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // CSV 파일로 저장
    const filename = `packet_archive_${currentYear}_${periodLabel}_admin_${adminId}.csv`;
    const filePath = path.join(archiveDir, filename);

    const writer = csvWriter();
    writer.pipe(fs.createWriteStream(filePath));
    packets.forEach((packet) => {
      writer.write(packet);
    });
    writer.end();

    console.log(`${packets.length}개의 데이터가 ${filename}에 저장되었습니다.`);

    // 아카이빙이 완료되면 해당 데이터를 삭제
    const deleteResult = await prisma.packet.deleteMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        employee: {
          adminId: adminId,
        },
      },
    });

    console.log(
      `${deleteResult.count}개의 데이터가 데이터베이스에서 삭제되었습니다.`
    );
  } catch (error) {
    console.error("데이터 아카이빙 중 오류 발생:", error);
  }
}

// 크론 작업 설정 및 내보내기
export function setupPacketArchiveCrons(): void {
  // 매년 7월 1일 0시 0분에 1~6월 데이터 아카이빙 (초 분 시 일 월 요일)
  cron.schedule("0 0 0 1 7 *", async () => {
    console.log("1~6월 데이터 아카이빙 작업 시작...");

    try {
      // 활성 상태인 모든 관리자 조회
      const admins = await prisma.admin.findMany({
        select: {
          id: true,
        },
      });

      // 각 관리자별로 아카이빙 실행
      for (const admin of admins) {
        await archivePacketData("first-half", admin.id);
      }

      console.log("1~6월 데이터 아카이빙 작업 완료");
    } catch (error) {
      console.error("관리자 정보 조회 중 오류 발생:", error);
    }
  });

  // 매년 1월 1일 0시 0분에 7~12월 데이터 아카이빙
  cron.schedule("0 0 0 1 1 *", async () => {
    console.log("7~12월 데이터 아카이빙 작업 시작...");

    try {
      // 활성 상태인 모든 관리자 조회
      const admins = await prisma.admin.findMany({
        select: {
          id: true,
        },
      });

      // 각 관리자별로 아카이빙 실행
      for (const admin of admins) {
        await archivePacketData("second-half", admin.id);
      }

      console.log("7~12월 데이터 아카이빙 작업 완료");
    } catch (error) {
      console.error("관리자 정보 조회 중 오류 발생:", error);
    }
  });

  console.log("패킷 데이터 아카이빙 스케줄러가 설정되었습니다.");
  console.log("- 1~6월 데이터: 매년 7월 1일 0시 0분에 실행");
  console.log("- 7~12월 데이터: 매년 1월 1일 0시 0분에 실행");
}
