"use client";
import React, { useState } from "react";
import styles from "../styles/NoticeHeader.module.css";

export default function NoticeHeader({activeTab,setActiveTab}) {

  return (
    <div className={styles.header}>
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "정보 공유" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("정보 공유")}
          >
            정보 공유
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "Q&A" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("Q&A")}
          >
            Q&A
          </button>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.myPostsBtn}>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
              d="M8 10C10.2091 10 12 8.20914 12 6C12 3.79086 10.2091 2 8 2C5.79086 2 4 3.79086 4 6C4 8.20914 5.79086 10 8 10Z"
              fill="#594A3E"
            />
            <path
              d="M0 20C0 16.6863 2.68629 14 6 14H10C13.3137 14 16 16.6863 16 20"
              stroke="#594A3E"
              strokeWidth="2"
            />
          </svg>
          내글 보기
        </button>
        <button className={styles.writeBtn}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path
              d="M1 1H11M4 1V0C4 0.552285 4.44772 1 5 1H7C7.55228 1 8 0.552285 8 0V1M9.5 1V19C9.5 20.1046 8.60457 21 7.5 21H2.5C1.39543 21 0.5 20.1046 0.5 19V1H9.5Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          게시물 작성
        </button>
      </div>
    </div>
  );
}
