"use client";

import styles from "./modal.module.css";
import { useState } from "react";

export default function Modal({
  message,
  title,
}: {
  message: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <p className={styles.modalMessage}>{message}</p>
            <button
              className={styles.modalButton}
              onClick={() => setIsOpen(!isOpen)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
