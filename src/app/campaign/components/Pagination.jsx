"use client";

import { useState } from "react";
import styles from "../styles/Pagination.module.css";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];

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

    const visiblePages = [1];

    visiblePages.forEach((page) => {
      pages.push(
        <button
          key={page}
          className={`${styles.pageButton} ${
            currentPage === page ? styles.active : ""
          }`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      );
    });

    // Ellipsis
    if (totalPages > 4) {
      pages.push(
        <span key="ellipsis" className={styles.ellipsis}>
          ...
        </span>
      );
    }

    // Last page
    if (totalPages > 3) {
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
