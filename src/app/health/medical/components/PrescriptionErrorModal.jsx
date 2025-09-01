"use client";

import React from "react";
import styles from "../styles/PrescriptionErrorModal.module.css";

export default function PrescriptionErrorModal({
  isOpen,
  onClose,
  errorMessage,
  errorDetails,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h3>처방전 처리 실패</h3>
              <p>처방전을 분석하는데 문제가 발생했습니다</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="#6B7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className={styles.content}>
          {/* 에러 메시지 */}
          <div className={styles.errorSection}>
            <div className={styles.errorIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.errorContent}>
              <h4>오류 내용</h4>
              <p className={styles.errorMessage}>{errorMessage}</p>
              {errorDetails && (
                <div className={styles.errorDetails}>
                  <h5>상세 정보</h5>
                  <p>{errorDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* 해결 방법 안내 */}
          <div className={styles.solutionSection}>
            <h4>해결 방법</h4>
            <ul className={styles.solutionList}>
              <li>처방전 이미지가 선명하고 잘 보이는지 확인해주세요</li>
              <li>처방전이 완전히 촬영되었는지 확인해주세요</li>
              <li>다른 처방전으로 다시 시도해보세요</li>
              <li>수동으로 투약 정보를 입력해주세요</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
