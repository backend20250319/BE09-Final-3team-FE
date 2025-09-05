"use client";

import React from "react";
import styles from "../styles/ScheduleDetailModal.module.css";
import { isSchedulePast } from "../utils/scheduleUtils";

export default function ScheduleDetailModal({
  isOpen,
  onClose,
  schedule,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !schedule) return null;

  // 지난 일정인지 확인
  const scheduleDate = schedule.startDate || schedule.date;
  const scheduleTime = schedule.scheduleTime || schedule.time;
  const isPast = isSchedulePast(scheduleDate, scheduleTime);

  const formatTime = (timeStr) => {
    if (!timeStr) return "시간 미정";
    return timeStr
      .split(",")
      .map((t) => t.trim())
      .join(", ");
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    try {
      // ISO 문자열인 경우 Date 객체로 변환
      const date = new Date(dateStr);

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return dateStr; // 유효하지 않으면 원본 반환
      }

      // YYYY년 MM월 DD일 형태로 포맷팅
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}년 ${month}월 ${day}일`;
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return dateStr; // 오류 시 원본 반환
    }
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
                  <span className={styles.value}>
                    {formatDate(schedule.startDate)}
                  </span>
                </div>
              )}
              {schedule.endDate && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>종료일</span>
                  <span className={styles.value}>
                    {formatDate(schedule.endDate)}
                  </span>
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
            {isPast && (
              <div className={styles.pastScheduleMessage}>
                지난 일정은 수정할 수 없습니다
              </div>
            )}
            <button
              className={`${styles.editButton} ${
                isPast ? styles.disabledButton : ""
              }`}
              onClick={() => !isPast && onEdit()}
              disabled={isPast}
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
