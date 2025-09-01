"use client";

import React from "react";
import styles from "../styles/UpdateResultModal.module.css";

export default function UpdateResultModal({
  isOpen,
  onClose,
  isSuccess,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.icon}>{isSuccess ? "✓" : "✕"}</div>
          <h2 className={styles.title}>
            {isSuccess ? "수정 완료!" : "수정 실패"}
          </h2>
          <p className={styles.message}>{message}</p>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
