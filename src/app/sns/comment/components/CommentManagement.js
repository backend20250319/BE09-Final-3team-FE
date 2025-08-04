"use client";

import { useState } from "react";
import styles from "../styles/CommentManagement.module.css";
import CommentAnalytics from "./CommentAnalytics";
import CommentList from "./CommentList";

export default function CommentManagement() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 댓글 분석 섹션 */}
        <CommentAnalytics />

        {/* 댓글 목록 섹션 */}
        <CommentList />
      </div>
    </div>
  );
}
