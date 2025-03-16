import prismaClient from "../util/prismaClient";

const getPackets = async (
  employeeId: number,
  cursor?: number,
  limit?: number,
  startDate?: string,
  endDate?: string
) => {
  // 날짜 형식이 문자열이므로 문자열 비교 조건 사용
  const whereCondition: any = {
    employeeId,
  };

  // 날짜 조건이 있는 경우에만 추가
  if (startDate || endDate) {
    whereCondition.time = {};

    if (startDate) {
      whereCondition.time.gte = startDate;
    }

    if (endDate) {
      whereCondition.time.lte = endDate;
    }
  }

  return prismaClient.packet.findMany({
    where: whereCondition,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit || 5,
    orderBy: {
      time: "asc",
    },
  });
};

// 특정 날짜만 조회하는 함수 추가
const getPacketsByDate = async (
  employeeId: number,
  date: string,
  cursor?: number,
  limit?: number
) => {
  // 날짜만 추출 (YYYY-MM-DD)
  const dateOnly = date.split("T")[0];

  return prismaClient.packet.findMany({
    where: {
      employeeId,
      // 해당 날짜로 시작하는 모든 시간 조회
      time: {
        startsWith: dateOnly,
      },
    },
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    take: limit || 5,
    orderBy: {
      time: "asc",
    },
  });
};

// 월별 조회 함수 추가
const getPacketsByMonth = async (
  employeeId: number,
  year: number,
  month: number
) => {
  // 월 형식 맞추기 (1 -> 01)
  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const yearMonthPrefix = `${year}-${monthStr}`;

  return prismaClient.packet.findMany({
    where: {
      employeeId,
      // 해당 년월로 시작하는 모든 시간 조회
      time: {
        startsWith: yearMonthPrefix,
      },
    },
    orderBy: {
      time: "asc",
    },
  });
};

export default {
  getPackets,
  getPacketsByDate,
  getPacketsByMonth,
};
