"use client";

import React from "react";
import styles from "../styles/ScheduleDetailModal.module.css";

export default function ScheduleDetailModal({
  isOpen,
  onClose,
  schedule,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !schedule) return null;

  const formatTime = (timeStr) => {
    if (!timeStr) return "시간 미정";
    return timeStr
      .split(",")
      .map((t) => t.trim())
      .join(", ");
  };

  const getScheduleTypeLabel = (category) => {
    switch (category) {
      case "medication":
        return "투약";
      case "care":
        return "돌봄";
      case "vaccination":
        return "접종";
      case "checkup":
        return "건강검진";
      default:
        return "기타";
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div
              className={styles.headerIcon}
              style={{ backgroundColor: schedule.color || "#E0E0E0" }}
            >
              {schedule.icon || "📅"}
            </div>
            <div className={styles.headerText}>
              <h3>{schedule.name || schedule.title}</h3>
              <p>
                {getScheduleTypeLabel(schedule.category || schedule.type)} 일정
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
              />
            </svg>
          </button>
        </div>

        {/* 상세 정보 */}
        <div className={styles.content}>
          <div className={styles.infoSection}>
            <h4>일정 정보</h4>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>일정 시간</span>
                <span className={styles.value}>
                  {formatTime(schedule.scheduleTime)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>빈도</span>
                <span className={styles.value}>
                  {schedule.frequency || "-"}
                </span>
              </div>
              {schedule.notificationTiming && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>알림 시기</span>
                  <span className={styles.value}>
                    {schedule.notificationTiming}
                  </span>
                </div>
              )}
              {schedule.startDate && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>시작일</span>
                  <span className={styles.value}>{schedule.startDate}</span>
                </div>
              )}
              {schedule.endDate && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>종료일</span>
                  <span className={styles.value}>{schedule.endDate}</span>
                </div>
              )}
            </div>
          </div>

          {schedule.description && (
            <div className={styles.descriptionSection}>
              <h4>설명</h4>
              <p>{schedule.description}</p>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className={styles.footer}>
          <button
            className={styles.deleteButton}
            onClick={() => {
              console.log("Delete button clicked in ScheduleDetailModal");
              console.log("Schedule to delete:", schedule);
              onDelete();
            }}
          >
            삭제
          </button>
          <div className={styles.actionButtons}>
            <button className={styles.editButton} onClick={onEdit}>
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
