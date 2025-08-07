"use client";

import React from "react";
import Calendar from "./MyCalendar";
import styles from "../styles/ActivityNavTabs.module.css";

export default function ActivityNavTabs({ isCalendarOpen, toggleCalendar }) {
  return (
    <div className={styles.navTabs}>
      <button className={`${styles.navTab} ${styles.active}`}>활동 관리</button>
      <button className={styles.navTab}>리포트</button>

      <div className={styles.navIcon} onClick={toggleCalendar}>
        <img
          src="/health/calendar.png"
          alt="캘린더 아이콘"
          className={styles.calendarIcon} // 추가한 클래스 이름
        />

        {isCalendarOpen && (
          <div className={styles.calendarPopup}>
            <Calendar />
          </div>
        )}
      </div>
    </div>
  );
}
