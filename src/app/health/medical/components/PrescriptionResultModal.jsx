"use client";

import React from "react";
import styles from "../styles/PrescriptionResultModal.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import { COLOR_MAP } from "../../constants/colors";

export default function PrescriptionResultModal({
  isOpen,
  onClose,
  prescriptionData,
}) {
  const { selectedPetName } = useSelectedPet();

  if (!isOpen) return null;

  // props로 받은 데이터 없으면 빈 객체 사용
  const data = prescriptionData || {};

  // OCR API 응답 구조 디버깅
  console.log("PrescriptionResultModal - prescriptionData:", prescriptionData);
  console.log("PrescriptionResultModal - data:", data);

  // 새로운 응답 형식에 맞게 수정: createdSchedules 정보 사용
  const createdSchedules = data.createdSchedules || 0;
  const scheduleNumbers = data.scheduleNo || [];

  // 백엔드에서 약물 정보를 받아온다면 사용, 아니면 빈 배열
  const extractedMedications =
    data.data?.medications ||
    data.medications ||
    data.extractedMedications ||
    [];

  console.log("PrescriptionResultModal - createdSchedules:", createdSchedules);
  console.log(
    "PrescriptionResultModal - extractedMedications:",
    extractedMedications
  );
  console.log("PrescriptionResultModal - data.data:", data.data);

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
      second: undefined, // 초는 표시하지 않음
    });
  };

  // 약물명에 따라 이모지를 결정하는 함수
  const getMedicationIcon = (medicationName) => {
    if (!medicationName) return "💊";

    const name = medicationName.toLowerCase();

    // 항생제
    if (name.includes("amoxicillin") || name.includes("항생제")) {
      return "💊";
    }
    // 소염진통제
    if (
      name.includes("firocoxib") ||
      name.includes("소염") ||
      name.includes("진통")
    ) {
      return "💊";
    }
    // 심장약
    if (name.includes("heart") || name.includes("심장")) {
      return "💊";
    }
    // 비타민/영양제
    if (
      name.includes("vitamin") ||
      name.includes("비타민") ||
      name.includes("영양")
    ) {
      return "💊";
    }
    // 알레르기약
    if (name.includes("allergy") || name.includes("알레르기")) {
      return "💊";
    }
    // 기본 약물 이모지
    return "💊";
  };

  const handleConfirm = async () => {
    // 이미 일정이 등록되었으므로 추가 작업 불필요
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <img
                src="/health/prescriptions.png"
                alt="처방전 아이콘"
                width={20}
                height={20}
              />
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
          {/* 처리 정보 */}
          <div className={styles.uploadInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>일정 등록 시간:</span>
              <span className={styles.value}>
                {new Date().toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: undefined, // 초는 표시하지 않음
                })}
              </span>
            </div>
          </div>

          {/* 등록된 약물 목록 */}
          <div className={styles.medicationsSection}>
            <h4>
              자동 등록된 약물 (
              {extractedMedications.length > 0
                ? extractedMedications.length
                : createdSchedules}
              개)
            </h4>
            <div className={styles.medicationsList}>
              {extractedMedications.length > 0 ? (
                extractedMedications.map((medication, index) => (
                  <div
                    key={medication.id || `medication-${index}`}
                    className={styles.medicationCard}
                  >
                    <div className={styles.medicationInfo}>
                      <div
                        className={styles.medicationIcon}
                        style={{
                          backgroundColor:
                            COLOR_MAP[medication.type] || "#e8f5e8",
                        }}
                      >
                        {medication.icon || "💊"}
                      </div>
                      <div className={styles.medicationDetails}>
                        <h5>{medication.name || medication.drugName}</h5>
                        <p className={styles.medicationType}>
                          {medication.type === "PILL"
                            ? "복용약"
                            : medication.type === "SUPPLEMENT"
                            ? "영양제"
                            : medication.type || "복용약"}
                        </p>
                        <p className={styles.medicationSchedule}>
                          {medication.frequency ||
                            medication.administration ||
                            medication.instructions}{" "}
                          •{" "}
                          {medication.duration ||
                            medication.prescriptionDays ||
                            "7일간"}
                        </p>
                        <p className={styles.medicationPeriod}>
                          {medication.startDate
                            ? new Date(medication.startDate).toLocaleDateString(
                                "ko-KR"
                              )
                            : new Date().toLocaleDateString("ko-KR")}{" "}
                          ~{" "}
                          {medication.endDate
                            ? new Date(medication.endDate).toLocaleDateString(
                                "ko-KR"
                              )
                            : new Date(
                                Date.now() + 7 * 24 * 60 * 60 * 1000
                              ).toLocaleDateString("ko-KR")}
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
                ))
              ) : createdSchedules > 0 ? (
                // 약물 정보가 없지만 일정은 등록된 경우 - 예쁜 카드 형태로 표시
                Array.from({ length: createdSchedules }, (_, index) => (
                  <div
                    key={`schedule-${index}`}
                    className={styles.medicationCard}
                  >
                    <div className={styles.medicationInfo}>
                      <div
                        className={styles.medicationIcon}
                        style={{
                          backgroundColor: "#e8f5e8",
                        }}
                      >
                        💊
                      </div>
                      <div className={styles.medicationDetails}>
                        <h5>처방전에서 추출된 약물 {index + 1}</h5>
                        <p className={styles.medicationType}>복용약</p>
                        <p className={styles.medicationSchedule}>
                          처방전에서 자동 추출됨
                        </p>
                        <p className={styles.medicationPeriod}>
                          {new Date().toLocaleDateString("ko-KR")} ~{" "}
                          {new Date(
                            Date.now() + 7 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("ko-KR")}
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
                ))
              ) : (
                <div className={styles.emptyMedications}>
                  <p>추출된 약물 정보가 없습니다.</p>
                  <p>처방전을 다시 확인해주세요.</p>
                </div>
              )}
            </div>
          </div>

          {/* 알림 설정 정보 */}
          <div className={styles.notificationInfo}>
            <div className={styles.infoIcon}>
              <img
                src="/health/pill.png"
                alt="알약 아이콘"
                width={16}
                height={16}
              />
            </div>
            <div className={styles.infoText}>
              <p>모든 약물에 대해 복용 알림이 자동으로 설정되었습니다.</p>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
