"use client";

import React from "react";
import { FiCheck, FiAlertTriangle, FiInfo } from "react-icons/fi";
import styles from "../styles/AlertModal.module.css";

export default function AlertModal({
  isOpen,
  onClose,
  title = "알림",
  message,
  type = "info", // "info", "success", "error", "warning"
  confirmText = "확인",
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheck size={32} className={styles.icon} />;
      case "error":
        return <FiAlertTriangle size={32} className={styles.icon} />;
      case "warning":
        return <FiAlertTriangle size={32} className={styles.icon} />;
      default:
        return <FiInfo size={32} className={styles.icon} />;
    }
  };

  const getIconContainerClass = () => {
    switch (type) {
      case "success":
        return styles.iconContainerSuccess;
      case "error":
        return styles.iconContainerError;
      case "warning":
        return styles.iconContainerWarning;
      default:
        return styles.iconContainerInfo;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={getIconContainerClass()}>{getIcon()}</div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.confirmButton} onClick={onClose}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
