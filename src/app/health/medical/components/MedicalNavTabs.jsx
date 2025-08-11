"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../styles/MedicalNavTabs.module.css";
import HealthCalendar from "../../components/HealthCalendar";

export default function MedicalNavTabs({
  activeTab,
  setActiveTab,
  isCalendarOpen,
  toggleCalendar,
  events = [],
  onEventClick,
}) {
  const iconRef = useRef(null);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const calendarWidth = 1228; // HealthCalendar의 너비
      const windowWidth = window.innerWidth;

      // 캘린더를 화면 중앙에 배치
      const left = Math.max(0, (windowWidth - calendarWidth) / 2);

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
              activeTab === "투약" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("투약")}
          >
            투약
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === "돌봄" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("돌봄")}
          >
            돌봄
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
              <HealthCalendar events={events} onEventClick={onEventClick} />
            </div>,
            document.body
          )}
      </div>
    </>
  );
}
