'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginRequiredModal.module.css';

export default function LoginRequiredModal({ isOpen, onClose, serviceName = "이 서비스" }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    router.push('/user/login');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>로그인이 필요합니다</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <div className={styles.lockIcon}>🔒</div>
          </div>
          <p className={styles.message}>
            {serviceName}를 이용하려면 로그인이 필요합니다.
          </p>
          <p className={styles.subMessage}>
            로그인 후 다양한 서비스를 이용해보세요.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={handleClose}>
            취소
          </button>
          <button className={styles.loginButton} onClick={handleLogin}>
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
