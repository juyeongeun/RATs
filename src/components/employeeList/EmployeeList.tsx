import styles from "./employeeList.module.css";
import { deleteEmployee, postEmployee } from "@/api/employee";
import { useState } from "react";

interface Employee {
  id: number;
  name: string;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
  adminId: number;
}

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function EmployeeList({
  employees,
  isLoading,
  onRefresh,
}: EmployeeListProps) {
  const [name, setName] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [clickedEmployeeId, setClickedEmployeeId] = useState<number | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const handleEdit = async () => {
    if (!name || !macAddress) return;

    try {
      setIsAdding(true);
      await postEmployee({ name, macAddress });
      setName("");
      setMacAddress("");
      onRefresh();
    } catch (error) {
      console.error("직원 추가 실패:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDeletingIds((prev) => [...prev, id]);
      await deleteEmployee(id);
      setClickedEmployeeId(null);
      onRefresh();
    } catch (error) {
      console.error("직원 삭제 실패:", error);
    } finally {
      setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleEmployeeClick = (employeeId: number) => {
    if (clickedEmployeeId === employeeId) {
      setClickedEmployeeId(null);
    } else {
      setClickedEmployeeId(employeeId);
    }
  };

  return (
    <div className={styles.employeeListContainer}>
      <div className={styles.employeeListHeader}>
        <h3 className={styles.employeeListHeaderTitle}>ADD EMPLOYEE</h3>
        <input
          type="text"
          placeholder="Employee Name"
          className={styles.employeeListInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isAdding}
        />
        <input
          type="text"
          placeholder="Employee Mac Address"
          className={styles.employeeListInput}
          value={macAddress}
          onChange={(e) => setMacAddress(e.target.value)}
          disabled={isAdding}
        />
        <div className={styles.employeeListButton}>
          <button
            onClick={handleEdit}
            disabled={isAdding || isLoading || !name || !macAddress}
          >
            {isAdding ? "추가 중..." : "ADD"}
          </button>
        </div>
      </div>
      {/* Employee List */}
      <h2 className={styles.employeeListTitle}>Employee List</h2>
      <div className={styles.employeeList}>
        {employees.map((employee: Employee, index: number) => {
          const isDeleting = deletingIds.includes(employee.id);
          return (
            <div
              key={`${employee.id}-${index}`}
              className={`${styles.employeeListNameContainer} ${
                clickedEmployeeId === employee.id ? styles.selected : ""
              }`}
              onClick={() => handleEmployeeClick(employee.id)}
            >
              <p className={styles.employeeListName}>
                {employee.name} {employee.macAddress}
              </p>
              {clickedEmployeeId === employee.id && (
                <div className={styles.employeeEditButton}>
                  <button
                    onClick={(e) => handleDelete(employee.id, e)}
                    disabled={isDeleting || isLoading}
                  >
                    {isDeleting ? "삭제 중..." : "DEL"}
                  </button>
                  <button>SHOW</button>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && <p>Loading...</p>}
      </div>
    </div>
  );
}
