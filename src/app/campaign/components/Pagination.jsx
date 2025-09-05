"use client";

import { useState, useEffect } from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];

    // 페이지가 1개 이하면 pagination 숨김
    if (totalPages <= 1) {
      return null;
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className={`${styles.pageButton} ${styles.navButton} ${
          currentPage === 1 ? styles.disabled : ""
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path
            d="M8 1L1 8L8 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    // 페이지 번호 생성 로직
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 시작 페이지가 1이 아니면 첫 페이지 추가
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className={`${styles.pageButton} ${
            currentPage === 1 ? styles.active : ""
          }`}
          onClick={() => handlePageClick(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className={styles.ellipsis}>
            ...
          </span>
        );
      }
    }

    // 현재 페이지 주변 페이지들
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 || startPage === 1) { // 첫 페이지는 이미 추가했으므로 제외
        pages.push(
          <button
            key={i}
            className={`${styles.pageButton} ${
              currentPage === i ? styles.active : ""
            }`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      }
    }

    // 마지막 페이지가 끝 페이지가 아니면 마지막 페이지 추가
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className={styles.ellipsis}>
            ...
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          className={`${styles.pageButton} ${
            currentPage === totalPages ? styles.active : ""
          }`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className={`${styles.pageButton} ${styles.navButton} ${
          currentPage === totalPages ? styles.disabled : ""
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path
            d="M2 1L9 8L2 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationContainer}>{renderPageNumbers()}</div>
    </div>
  );
}
