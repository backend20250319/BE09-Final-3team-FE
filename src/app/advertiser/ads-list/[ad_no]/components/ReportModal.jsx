"use client";

import React, { useState } from "react";
import Image from "next/image";
import { reportUser } from "@/api/userApi";
import AlertModal from "@/app/community/components/AlertModal";
import styles from "../styles/ReportModal.module.css";

export default function ReportModal({
  isOpen,
  onClose,
  applicantName,
  onReportSuccess,
}) {
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reportReason.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        reason: reportReason.trim(),
        targetName: applicantName,
      };

      await reportUser(payload);

      setAlertMessage("신고가 접수되었습니다.");
      setAlertType("success");
      setShowAlertModal(true);
      onReportSuccess?.();
      handleCancel();
    } catch (error) {
      console.error("신고 제출 실패:", error);
      setAlertMessage(
        error?.response?.data?.message || "신고 제출에 실패했습니다."
      );
      setAlertType("error");
      setShowAlertModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setReportReason("");
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
                <p className={styles.reportSubtitle}>
                  {applicantName}님을 신고하시겠습니까?
                </p>
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
                placeholder="신고 사유를 구체적으로 입력해주세요"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={6}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className={styles.footerSection}>
          <div className={styles.buttonContainer}>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!reportReason.trim() || isSubmitting}
            >
              {isSubmitting ? (
                "신고 중..."
              ) : (
                <>
                  <Image
                    src="/icons/report-icon.svg"
                    alt="Report"
                    width={24}
                    height={24}
                    className={styles.reportIcon}
                  />
                  신고하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="알림"
        message={alertMessage}
        type={alertType}
        confirmText="확인"
      />
    </div>
  );
}
