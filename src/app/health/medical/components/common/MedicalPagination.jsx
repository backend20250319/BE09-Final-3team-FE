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
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return (
    <div className={`${styles.pagination} ${className || ""}`}>
      {pages.map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${
            page === currentPage ? styles.activePage : ""
          }`}
          onClick={() => page !== "..." && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
