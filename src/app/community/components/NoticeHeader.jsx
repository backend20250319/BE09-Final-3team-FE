"use client";
import React, { useState } from "react";
import styles from "../styles/NoticeHeader.module.css";
import {useRouter} from "next/navigation";
import SubHeader from "@/app/components/SubHeader";

export default function NoticeHeader({activeType,activeTab,onChangeType,mineOnly,onToggleMine}) {
  const router = useRouter();
  const current = activeType ?? activeTab;

  const handleAdd = () => {
    router.push('/community/new');
  }
  return (
      <div>
      <SubHeader title={"커뮤니티"} subtitle={"반려동물 애호가들과 팁을 공유하고 소통하세요."} />
      <div className={styles.header}>
        <div className={styles.tabContainer}>
          <div className={styles.tabs}>
            <button
                type="button"
                className={`${styles.tab} ${
                    current === "INFORMATION" ? styles.active : ""
                }`}
                aria-selected={current === "INFORMATION"}
                onClick={() => onChangeType?.("INFORMATION")}
            >
              정보 공유
            </button>

            <button
                type="button"
                className={`${styles.tab} ${
                    current === "QUESTION" ? styles.active : ""
                }`}
                aria-selected={current === "QUESTION"}
                onClick={() => onChangeType?.("QUESTION")}
            >
              Q&A
            </button>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={`${styles.myPostsBtn} ${mineOnly ? styles.active : ""}`}
                  onClick={onToggleMine}
                  aria-pressed={mineOnly}>
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
          <button className={styles.writeBtn} onClick={handleAdd}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 0.9375C7 0.453516 6.60898 0.0625 6.125 0.0625C5.64102 0.0625 5.25 0.453516 5.25 0.9375V4.875H1.3125C0.828516 4.875 0.4375 5.26602 0.4375 5.75C0.4375 6.23398 0.828516 6.625 1.3125 6.625H5.25V10.5625C5.25 11.0465 5.64102 11.4375 6.125 11.4375C6.60898 11.4375 7 11.0465 7 10.5625V6.625H10.9375C11.4215 6.625 11.8125 6.23398 11.8125 5.75C11.8125 5.26602 11.4215 4.875 10.9375 4.875H7V0.9375Z" fill="white"/>
            </svg>
            게시물 작성
          </button>
        </div>
      </div>
      </div>
  );
}
