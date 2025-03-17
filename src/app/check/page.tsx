"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import EmployeeList from "@/components/employeeList/EmployeeList";
import UpData from "@/components/dataList/UpData";
import DownData from "@/components/dataList/DownData";
import styles from "./page.module.css";
import { getEmployee } from "@/api/employee";
import { getPacketList, getPacketMonthList } from "@/api/packet";

interface Employee {
  id: number;
  name: string;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
  adminId: number;
}

interface EmployeeResponse {
  employees: Employee[];
}

interface Packet {
  id: number;
  time: string;
  macAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  employeeId: number;
}

export default function Check() {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [packetList, setPacketList] = useState<Packet[]>([]);
  const [packetMonthList, setPacketMonthList] = useState<Packet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (keyword?: string) => {
    try {
      const response: EmployeeResponse = await getEmployee(keyword);
      setEmployeeList(response.employees);
    } catch (err) {
      console.error("직원 목록 가져오기 실패:", err);
      setError("직원 목록을 불러오는데 실패했습니다.");
    }
  };

  const handleSearch = (keyword: string) => {
    fetchEmployees(keyword);
  };

  const handleRefresh = () => {
    setEmployeeList([]);
    fetchEmployees();
  };

  const handleShow = async (id: number) => {
    setSelectedEmployeeId(id);
    await fetchPacketData(id, selectedDate);
  };

  const handleDateChange = async (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedDate(formattedDate);

    if (selectedEmployeeId !== null) {
      await fetchPacketData(selectedEmployeeId, formattedDate);
    }
  };

  const fetchPacketData = async (employeeId: number, date: string) => {
    try {
      const data = await getPacketList(employeeId, date);
      const monthData = await getPacketMonthList(employeeId, date);
      setPacketList(data);
      setPacketMonthList(monthData);
    } catch (error) {
      console.error("패킷 데이터 가져오기 실패:", error);
      setPacketList([]);
      setPacketMonthList([]);
    }
  };

  return (
    <div className={styles.container}>
      <Header handleSearch={handleSearch} />
      <hr />
      <div className={styles.dataContainer}>
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <>
            <EmployeeList
              employees={employeeList}
              onRefresh={handleRefresh}
              onShow={handleShow}
            />
            <div className={styles.verticalLine}></div>
          </>
        )}
        <div className={styles.packetContainer}>
          {employeeList.length > 0 ? (
            <>
              <UpData
                packetList={packetList}
                packetMonthList={packetMonthList}
                date={selectedDate}
                onDateChange={handleDateChange}
                isLoading={isLoading}
                employeeName={
                  employeeList.find(
                    (employee) => employee.id === selectedEmployeeId
                  )?.name || ""
                }
              />
              <hr />
              <DownData dayList={packetList} />
            </>
          ) : (
            <>
              <UpData
                packetList={[]}
                packetMonthList={[]}
                date={selectedDate}
                onDateChange={handleDateChange}
                isLoading={isLoading}
                employeeName={
                  employeeList.find(
                    (employee) => employee.id === selectedEmployeeId
                  )?.name || ""
                }
              />
              <hr />
              <DownData dayList={[]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
