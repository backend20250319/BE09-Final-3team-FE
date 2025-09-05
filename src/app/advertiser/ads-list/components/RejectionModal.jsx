"use client"

import React from 'react';
import Image from 'next/image';
import styles from "../styles/RejectionModal.module.css";

export default function RejectionModal({ isOpen, onClose, rejectionData }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleReject = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Image
                src="/advertiser/rejection.png"
                alt="rejection.png"
                width={24}
                height={24} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.modalTitle}>반려 사유</h2>
              <p className={styles.modalSubtitle}>해당 광고가 반려된 사유를 확인해보세요</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>광고 제목</h3>
            </div>
            <div className={styles.campaignTitle}>
              <p className={styles.titleText}>
                {rejectionData?.campaignTitle || "광고 제목"}
              </p>
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>반려 사유</h3>
            </div>
            <div className={styles.rejectionReason}>
              <p className={styles.reasonText}>
                {rejectionData?.reason || "광고 필수 요소(체험단 선정일) 누락됨"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
