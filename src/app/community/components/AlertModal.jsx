"use client";

import React from "react";
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

  const getIconSrc = () => {
    switch (type) {
      case "success":
        return "/health/check.png";
      case "error":
        return "/icons/siren.png";
      case "warning":
        return "/icons/siren.png";
      default:
        return "/icons/notification-icon.svg";
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
          <div className={getIconContainerClass()}>
            <img src={getIconSrc()} alt="알림 아이콘" className={styles.icon} />
          </div>
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
