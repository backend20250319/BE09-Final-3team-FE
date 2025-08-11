"use client";

import React from "react";
import styles from "../styles/ActivityRecordView.module.css";

export default function ActivityRecordView({
  isOpen,
  onClose,
  recordData,
  date,
}) {
  if (!isOpen || !recordData) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{formatDate(date)} 활동 기록</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <img src="/health/close.png" alt="닫기" width={20} height={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* 산책 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/footprint.png"
                alt="산책 아이콘"
                className={styles.sectionIcon}
              />
              <h3>산책 활동</h3>
            </div>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.label}>산책 거리</span>
                <span className={styles.value}>
                  {recordData.walkingDistance} km
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>활동량</span>
                <span className={styles.value}>{recordData.activityLevel}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>소모 칼로리</span>
                <span className={styles.value}>
                  {recordData.walk_calories} kcal
                </span>
              </div>
            </div>
          </div>

          {/* 식사 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/meal.png"
                alt="식사 아이콘"
                className={styles.sectionIcon}
              />
              <h3>식사 활동</h3>
            </div>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.label}>총 그람수</span>
                <span className={styles.value}>
                  {recordData.totalFoodWeight} g
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>총 칼로리</span>
                <span className={styles.value}>
                  {recordData.totalCaloriesInFood} kcal
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>섭취량</span>
                <span className={styles.value}>
                  {recordData.feedingAmount} g
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>섭취 칼로리</span>
                <span className={styles.value}>
                  {recordData.eat_calories} kcal
                </span>
              </div>
            </div>
          </div>

          {/* 기타 활동 */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <img
                src="/health/weight.png"
                alt="기타 아이콘"
                className={styles.sectionIcon}
              />
              <h3>기타 활동</h3>
            </div>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.label}>몸무게</span>
                <span className={styles.value}>{recordData.weight} kg</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>수면 시간</span>
                <span className={styles.value}>
                  {recordData.sleepTime} 시간
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>소변 횟수</span>
                <span className={styles.value}>{recordData.urineCount} 회</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.label}>대변 횟수</span>
                <span className={styles.value}>{recordData.fecesCount} 회</span>
              </div>
            </div>
          </div>

          {/* 메모 */}
          {recordData.memo && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <img
                  src="/health/pencil.png"
                  alt="메모 아이콘"
                  className={styles.sectionIcon}
                />
                <h3>메모</h3>
              </div>
              <div className={styles.memoContent}>{recordData.memo}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


