"use client";
import React from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination(
    page,              // 현재 페이지 (0-based)
    totalPages,        // 총 페이지 수
    onChange,          // (nextPage:number) => void
    windowSize = 5,    // 가운데 기준으로 보여줄 버튼 개수
    styles = {},       // { pageBtn, active, ellipsis } css module 지원
) {
  return (
    <div className={styles.container}>
      <button className={styles.prevBtn} onClick={() => onChange(page - 1)} disabled={page <= 0}>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path
            d="M8 2L2 8L8 14"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button className={styles.pageBtn + " " + styles.active}>1</button>
      <button className={styles.pageBtn}>2</button>
      <button className={styles.pageBtn}>3</button>
      <button className={styles.nextBtn} onClick={() => onChange(page + 1)} disabled={totalPages ? page >= totalPages - 1 : false}>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path
            d="M2 2L8 8L2 14"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
