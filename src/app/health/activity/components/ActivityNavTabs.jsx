"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Calendar from "./MyCalendar";
import styles from "../styles/ActivityNavTabs.module.css";

export default function ActivityNavTabs({ isCalendarOpen, toggleCalendar }) {
  const iconRef = useRef(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isCalendarOpen && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setIconPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 250 + rect.width, // 캘린더를 아이콘 오른쪽 끝에 맞춤
      });
    }
  }, [isCalendarOpen]);

  return (
    <>
      <div className={styles.navTabs}>
        <button className={`${styles.navTab} ${styles.active}`}>
          활동 관리
        </button>
        <button className={styles.navTab}>리포트</button>

        <div ref={iconRef} className={styles.navIcon} onClick={toggleCalendar}>
          <img
            src="/health/calendar.png"
            alt="캘린더 아이콘"
            className={styles.calendarIcon}
          />
        </div>
      </div>

      {/* 토글 드롭다운 Portal */}
      {isCalendarOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className={styles.calendarDropdown}
            style={{
              top: `${iconPosition.top}px`,
              left: `${iconPosition.left}px`,
            }}
          >
            <Calendar />
          </div>,
          document.body
        )}
    </>
  );
}
