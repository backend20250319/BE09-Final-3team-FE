"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/ReportModal.module.css';

export default function ReportModal({ isOpen, onClose, applicantName }) {
  const [reportReason, setReportReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 신고 제출 로직
    console.log('신고 사유:', reportReason);
    console.log('신고 대상:', applicantName);
    onClose();
    setReportReason('');
  };

  const handleCancel = () => {
    onClose();
    setReportReason('');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <div className={styles.warningIcon}>
                <Image
                  src="/icons/report.png"
                  alt="Warning"
                  width={24}
                  height={24}
                />
              </div>
              <div className={styles.headerText}>
                <h3 className={styles.reportTitle}>신고하기</h3>
                <p className={styles.reportSubtitle}>해당 유저를 신고하시겠습니까?</p>
              </div>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.contentSection}>
          <div className={styles.reportForm}>
            <div className={styles.formHeader}>
              <label className={styles.formLabel}>신고 사유</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.textareaContainer}>
              <textarea
                className={styles.reportTextarea}
                placeholder="신고 사유를 입력하세요"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className={styles.footerSection}>
          <div className={styles.buttonContainer}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              취소
            </button>
            <button 
              className={styles.submitButton} 
              onClick={handleSubmit}
              disabled={!reportReason.trim()}
            >
              <Image
                src="/icons/report-icon.svg"
                alt="Report"
                width={24}
                height={24}
                className={styles.reportIcon}
              />
              신고하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
