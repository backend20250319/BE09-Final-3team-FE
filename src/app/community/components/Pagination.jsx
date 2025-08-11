"use client";
import React from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination() {
  return (
    <div className={styles.container}>
      <button className={styles.prevBtn}>
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
      <button className={styles.nextBtn}>
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
