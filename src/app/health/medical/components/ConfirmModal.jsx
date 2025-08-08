import React from "react";
import styles from "../styles/ConfirmModal.module.css";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            확인
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
