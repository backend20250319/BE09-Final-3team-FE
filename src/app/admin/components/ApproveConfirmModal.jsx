"use client";

import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import styles from "../styles/ApproveConfirmModal.module.css";

export default function ApproveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "승인 확인",
  message = "정말로 승인하시겠습니까?",
  confirmText = "승인",
  cancelText = "취소",
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <FiCheckCircle size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>
            {message}
            <br />
            승인 후에는 즉시 반영됩니다.
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
