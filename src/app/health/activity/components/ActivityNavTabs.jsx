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
      setIconPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [iconRef, isCalendarOpen]);

  return (
    <>
      <div className={styles.navSection}>
        <div className={styles.navTabs}>
          <button
            className={`${styles.navTab} ${
              activeTab === "활동 관리" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("활동 관리")}
          >
            활동 관리
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
              className={styles.calendarDropdown}
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
