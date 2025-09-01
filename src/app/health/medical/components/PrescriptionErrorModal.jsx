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
            <div className={styles.errorContent}>
              <h4>오류 내용</h4>
              <p className={styles.errorMessage}>{errorMessage}</p>
              {errorDetails && (
                <div className={styles.errorDetails}>
                  <h5>추가 안내</h5>
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
