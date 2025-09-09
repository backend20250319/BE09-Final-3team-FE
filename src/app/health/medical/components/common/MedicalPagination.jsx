"use client";

import React from "react";
import styles from "../../styles/MedicationManagement.module.css";

export default function MedicalPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) {
  const pages = [];
  const maxVisible = 3; // 최대 3페이지까지만 표시

  // 페이지 번호 생성
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 2) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 1) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 1; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
  }

  return (
    <div className={`${styles.pagination} ${className || ""}`}>
      {/* 이전 버튼 */}
      {currentPage > 1 && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage - 1)}
          title="이전 페이지"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M7.5 3L4.5 6L7.5 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* 페이지 번호들 */}
      {pages.map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.activePage : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 버튼 */}
      {currentPage < totalPages && (
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(currentPage + 1)}
          title="다음 페이지"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4.5 3L7.5 6L4.5 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
