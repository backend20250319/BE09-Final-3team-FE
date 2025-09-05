"use client";

import React from "react";
import styles from "../styles/SaveCompleteModal.module.css";

export default function SaveCompleteModal({
  isOpen,
  onClose,
  onConfirm,
  petName,
  date,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <img
              src="/health/save.png"
              alt="저장 완료 아이콘"
              className={styles.icon}
            />
          </div>
          <h2 className={styles.title}>저장 완료!</h2>
          <p className={styles.message}>
            {petName}의 {date} 활동 기록이 저장되었습니다.
          </p>
          <button className={styles.closeButton} onClick={onConfirm || onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
