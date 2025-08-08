import React, { useEffect, useState } from "react";
import styles from "../styles/Toast.module.css";

export default function Toast({ message, type, duration = 1000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeoutShow = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    const timeoutHide = setTimeout(() => {
      onClose();
    }, duration + 500);

    return () => {
      clearTimeout(timeoutShow);
      clearTimeout(timeoutHide);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`${styles.toast} ${
        type === "active" ? styles.toastActive : styles.toastInactive
      } ${isVisible ? styles.fadeIn : styles.fadeOut}`}
    >
      {message}
    </div>
  );
}
