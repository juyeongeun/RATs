import styles from "./upData.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { formatDate, formatTime } from "@/app/util/dateFormat";
import MonthGraph from "./MonthGraph";
interface PacketList {
  id: number;
  time: string;
  macAddress: string;
  status: string;
}

interface UpDataProps {
  packetList: PacketList[];
  packetMonthList: PacketList[];
  date: string;
  onDateChange: (date: Date) => void;
  isLoading: boolean;
  employeeName: string;
}

export default function UpData({
  packetList,
  packetMonthList,
  date,
  onDateChange,
  isLoading,
  employeeName,
}: UpDataProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    date ? new Date(date) : new Date()
  );

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateChange(date);
    }
  };

  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date));
    }
  }, [date]);

  return (
    <div className={styles.upDataContainer}>
      <div className={styles.upDataLeft}>
        <div className={styles.upDataHeader}>
          <div className={styles.upDataHeaderInfo}>
            <p className={styles.upDataHeaderTitle}>Packet List</p>
            {employeeName && (
              <p className={styles.upDataHeaderEmployee}>
                직원: {employeeName}
              </p>
            )}
          </div>
          <div className={styles.upDataHeaderDateContainer}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className={styles.upDataHeaderDate}
            />
          </div>
        </div>
        <div className={styles.packetListContainer}>
          {isLoading ? (
            <div className={styles.loadingIndicator}>
              데이터를 불러오는 중...
            </div>
          ) : (
            <table className={styles.packetListTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>MAC</th>
                  <th>Status</th>
                </tr>
              </thead>
              {packetList.length > 0 ? (
                <tbody className={styles.packetListTableBody}>
                  {(() => {
                    const firstConnect = packetList.find(
                      (p) => p.status === "CONNECT"
                    );
                    const firstConnectId = firstConnect
                      ? firstConnect.id
                      : null;

                    return packetList.map((packet) => (
                      <tr
                        key={packet.id}
                        className={
                          packet.id === firstConnectId
                            ? formatTime(new Date(packet.time)) <= "09:00:00"
                              ? styles.good
                              : styles.bad
                            : ""
                        }
                      >
                        <td>{formatDate(new Date(packet.time))}</td>
                        <td>{formatTime(new Date(packet.time))}</td>
                        <td>{packet.macAddress}</td>
                        <td>{packet.status}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              ) : (
                <tbody className={styles.packetListTableBody}>
                  <tr>
                    <td colSpan={4}>선택한 날짜에 데이터가 없습니다.</td>
                  </tr>
                </tbody>
              )}
            </table>
          )}
        </div>
      </div>
      <div className={styles.upDataRight}>
        <MonthGraph monthList={packetMonthList} />
      </div>
    </div>
  );
}
