"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header/Header";
import EmployeeList from "@/components/employeeList/EmployeeList";
import styles from "./page.module.css";
import { getEmployee } from "@/api/employee";

interface Employee {
  id: number;
  name: string;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
  adminId: number;
}

interface PaginationInfo {
  nextCursor: number | null;
  hasMore: boolean;
}

interface EmployeeResponse {
  employees: Employee[];
  pagination: PaginationInfo;
}

export default function Check() {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 직원 데이터 가져오기
  const fetchEmployees = async (cursor?: number, keyword?: string) => {
    try {
      setIsLoading(true);
      const response: EmployeeResponse = await getEmployee(cursor, keyword);

      if (cursor) {
        // 추가 데이터 로드 시 기존 목록에 추가
        setEmployeeList((prev) => [...prev, ...response.employees]);
      } else {
        // 초기 로드
        setEmployeeList(response.employees);
      }

      setPagination(response.pagination);
    } catch (err) {
      console.error("직원 목록 가져오기 실패:", err);
      setError("직원 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 더 보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    if (pagination?.hasMore && pagination?.nextCursor) {
      fetchEmployees(pagination.nextCursor);
    }
  };

  const handleSearch = (keyword: string) => {
    fetchEmployees(0, keyword);
  };

  // Check 컴포넌트 내부에 새로고침 함수 추가
  const handleRefresh = () => {
    // 데이터 초기화 후 다시 불러오기
    setEmployeeList([]);
    setPagination(null);
    fetchEmployees();
  };

  return (
    <div className={styles.container}>
      <Header handleSearch={handleSearch} />
      <div className={styles.line}></div>
      <div className={styles.dataContainer}>
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <>
            <EmployeeList
              employees={employeeList}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
            <div className={styles.verticalLine}></div>
          </>
        )}
      </div>
    </div>
  );
}
