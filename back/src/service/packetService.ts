import packetRepository from "../repository/packetRepository";

const getPackets = async (
  employeeId: number,
  cursor?: number,
  limit?: number,
  startDate?: string,
  endDate?: string
) => {
  return packetRepository.getPackets(
    employeeId,
    cursor,
    limit,
    startDate,
    endDate
  );
};

const getPacketsByDate = async (
  employeeId: number,
  date: string,
  cursor?: number,
  limit?: number
) => {
  return packetRepository.getPacketsByDate(employeeId, date, cursor, limit);
};

const getPacketsByMonth = async (
  employeeId: number,
  year: number,
  month: number
) => {
  return packetRepository.getPacketsByMonth(employeeId, year, month);
};

export default {
  getPackets,
  getPacketsByDate,
  getPacketsByMonth,
};
