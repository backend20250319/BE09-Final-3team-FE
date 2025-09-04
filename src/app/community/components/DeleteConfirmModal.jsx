"use client";

import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "../styles/DeleteConfirmModal.module.css";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "삭제 확인",
  message = "정말로 삭제하시겠습니까?",
  confirmText = "삭제",
  cancelText = "취소",
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <FiAlertTriangle size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>
            {message}
            <br />
            삭제된 내용은 복구할 수 없습니다.
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={onClose}>
              {cancelText}
            </button>
            <button className={styles.confirmButton} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
