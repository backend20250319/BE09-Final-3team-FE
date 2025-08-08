"use client";

import React from "react";
import styles from "../styles/PrescriptionResultModal.module.css";

export default function PrescriptionResultModal({
  isOpen,
  onClose,
  prescriptionData,
}) {
  if (!isOpen) return null;

  // 예시 데이터 (실제로는 props로 받아올 데이터)
  const sampleData = {
    originalText: "아목시실린 500mg 1일 3회 7일간 복용",
    extractedMedications: [
      {
        id: 1,
        name: "아목시실린 500mg",
        type: "복용약",
        frequency: "하루에 세 번",
        duration: 7,
        startDate: "2025-01-15",
        endDate: "2025-01-21",
        icon: "💊",
        color: "#E3F2FD",
        isNotified: true,
      },
      {
        id: 2,
        name: "타이레놀 500mg",
        type: "복용약",
        frequency: "하루에 두 번",
        duration: 5,
        startDate: "2025-01-15",
        endDate: "2025-01-19",
        icon: "💊",
        color: "#E3F2FD",
        isNotified: true,
      },
    ],
    uploadTime: "2025-01-15 14:30",
    fileName: "prescription_001.jpg",
  };

  const data = prescriptionData || sampleData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L10 18M2 10L18 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h3>처방전 분석 결과</h3>
              <p>OCR로 추출된 약물 정보가 자동으로 등록되었습니다</p>
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
          {/* 업로드 정보 */}
          <div className={styles.uploadInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>파일명:</span>
              <span className={styles.value}>{data.fileName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>업로드 시간:</span>
              <span className={styles.value}>
                {formatDate(data.uploadTime)} {formatTime(data.uploadTime)}
              </span>
            </div>
          </div>

          {/* 원본 텍스트 */}
          <div className={styles.originalTextSection}>
            <h4>추출된 원본 텍스트</h4>
            <div className={styles.originalText}>{data.originalText}</div>
          </div>

          {/* 등록된 약물 목록 */}
          <div className={styles.medicationsSection}>
            <h4>자동 등록된 약물 ({data.extractedMedications.length}개)</h4>
            <div className={styles.medicationsList}>
              {data.extractedMedications.map((medication) => (
                <div key={medication.id} className={styles.medicationCard}>
                  <div className={styles.medicationInfo}>
                    <div
                      className={styles.medicationIcon}
                      style={{ backgroundColor: medication.color }}
                    >
                      {medication.icon}
                    </div>
                    <div className={styles.medicationDetails}>
                      <h5>{medication.name}</h5>
                      <p className={styles.medicationType}>{medication.type}</p>
                      <p className={styles.medicationSchedule}>
                        {medication.frequency} • {medication.duration}일간
                      </p>
                      <p className={styles.medicationPeriod}>
                        {formatDate(medication.startDate)} ~{" "}
                        {formatDate(medication.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className={styles.medicationStatus}>
                    <div className={styles.statusBadge}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      자동 등록됨
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 알림 설정 정보 */}
          <div className={styles.notificationInfo}>
            <div className={styles.infoIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1V15M1 8H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className={styles.infoText}>
              <p>모든 약물에 대해 복용 알림이 자동으로 설정되었습니다.</p>
              <p>마이페이지에서 알림 설정을 변경할 수 있습니다.</p>
            </div>
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
