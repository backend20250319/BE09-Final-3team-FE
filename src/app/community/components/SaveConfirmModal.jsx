"use client";

import React from "react";
import styles from "../styles/SaveConfirmModal.module.css";

export default function SaveConfirmModal({
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
              src="/health/check.png"
              alt="확인 아이콘"
              className={styles.icon}
            />
          </div>
          <h2 className={styles.title}>저장 확인</h2>
          <p className={styles.message}>
            정말로 저장하시겠습니까?
            <br />
            저장은 하루에 한번만 가능합니다.
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={onClose}>
              취소
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
