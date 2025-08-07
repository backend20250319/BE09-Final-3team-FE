"use client";

import React from "react";
import styles from "../styles/CareSchedule.module.css";

export default function CareSchedule() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3>돌봄 일정 관리</h3>
        <div className={styles.schedulePlaceholder}>
          <div className={styles.placeholderIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect
                x="6"
                y="12"
                width="36"
                height="30"
                rx="3"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <path d="M6 18H42" stroke="#9CA3AF" strokeWidth="2" />
              <path
                d="M15 6V12"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M33 6V12"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p>돌봄 일정을 관리하고 스케줄을 확인하세요</p>
        </div>
      </div>
    </div>
  );
}
