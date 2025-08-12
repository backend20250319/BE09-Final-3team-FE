"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/ActivityNavTabs.module.css";
import Calendar from "./MyCalendar";

export default function ActivityNavTabs({
  activeTab,
  setActiveTab,
  isCalendarOpen,
  toggleCalendar,
}) {
  const iconRef = useRef(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const calendarWidth = 400; // 달력의 대략적인 너비
      const windowWidth = window.innerWidth;

      let left = rect.left + window.scrollX;

      // 달력이 오른쪽으로 나가서 화면을 벗어나는 경우
      if (left + calendarWidth > windowWidth) {
        // 달력을 아이콘의 왼쪽에 배치하되, 화면 안에 들어오도록 조정
        left = Math.max(0, windowWidth - calendarWidth - 20); // 20px 여백 추가
      } else {
        // 기본적으로 아이콘의 왼쪽에 배치
        left = rect.left + window.scrollX - calendarWidth;

        // 왼쪽으로 나가서 화면을 벗어나는 경우
        if (left < 0) {
          left = 20; // 왼쪽에 20px 여백
        }
      }

      setIconPosition({
        top: rect.bottom + window.scrollY + 8,
        left: left,
      });
    }
  }, [iconRef, isCalendarOpen]);

  return (
    <>
      <div className={styles.navSection}>
        <div className={styles.navTabs}>
          <button
            className={`${styles.navTab} ${
              activeTab === "활동 기록" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("활동 기록")}
          >
            활동 기록
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === "리포트" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("리포트")}
          >
            리포트
          </button>

          <div
            ref={iconRef}
            className={styles.navIcon}
            onClick={toggleCalendar}
            role="button"
            tabIndex={0}
            aria-label="캘린더 토글"
          >
            <img
              src="/health/calendar.png"
              alt="캘린더 아이콘"
              className={styles.calendarIcon}
            />
          </div>
        </div>

        {isCalendarOpen &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              className={`${styles.calendarDropdown} ${
                iconPosition.left + 400 > window.innerWidth
                  ? styles.rightAligned
                  : ""
              }`}
              style={{ top: iconPosition.top, left: iconPosition.left }}
            >
              <Calendar />
            </div>,
            document.body
          )}
      </div>
    </>
  );
}
