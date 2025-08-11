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

  const getToastClass = () => {
    if (type === "delete") return styles.toastDelete;
    if (type === "active") return styles.toastActive;
    return styles.toastInactive;
  };

  return (
    <div
      className={`${styles.toast} ${getToastClass()} ${
        isVisible ? styles.fadeIn : styles.fadeOut
      }`}
    >
      {message}
    </div>
  );
}
