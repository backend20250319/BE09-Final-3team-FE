"use client";

import { useState } from "react";
import { useSns } from "../../context/SnsContext";
import styles from "../../styles/comment/CommentManagement.module.css";
import CommentAnalytics from "./CommentAnalytics";
import CommentList from "./CommentList";

export default function CommentManagement() {
  const { selectedInstagramProfile } = useSns();

  return (
    <>
      {/* 댓글 분석 섹션 */}
      <CommentAnalytics />

      {/* 섹션 간 간격 */}
      <div style={{ marginBottom: "32px" }} />

      {/* 댓글 목록 섹션 */}
      <CommentList instagram_id={selectedInstagramProfile?.id} />
    </>
  );
}
