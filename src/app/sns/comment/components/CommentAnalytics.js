"use client";

import { useState } from "react";
import styles from "../styles/CommentAnalytics.module.css";
import StatsCard from "./StatsCard";
import BannedWords from "./BannedWords";
import SentimentAnalysis from "./SentimentAnalysis";

export default function CommentAnalytics() {
  const [autoManageEnabled, setAutoManageEnabled] = useState(true);

  const statsData = [
    {
      id: 1,
      icon: "message",
      label: "총 댓글 수",
      value: "1,247",
      color: "#3B82F6",
      bgColor: "#EFF6FF",
      borderColor: "#BFDBFE",
    },
    {
      id: 2,
      icon: "delete",
      label: "자동 삭제",
      value: "89",
      color: "#EF4444",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
    },
    {
      id: 3,
      icon: "percentage",
      label: "삭제 비율",
      value: "7.1%",
      color: "#22C55E",
      bgColor: "#F0FDF4",
      borderColor: "#BBF7D0",
    },
    {
      id: 4,
      icon: "ban",
      label: "금지어 개수",
      value: "24",
      color: "#A855F7",
      bgColor: "#FAF5FF",
      borderColor: "#E9D5FF",
    },
  ];

  return (
    <div className={styles.analyticsSection}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>댓글 분석</h1>
        <div className={styles.autoManage}>
          <span className={styles.autoManageLabel}>자동 댓글 관리</span>
          <button
            className={`${styles.toggle} ${
              autoManageEnabled ? styles.enabled : ""
            }`}
            onClick={() => setAutoManageEnabled(!autoManageEnabled)}
          >
            <div className={styles.toggleSwitch}></div>
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className={styles.statsGrid}>
        {statsData.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* 금지어 관리 */}
      <BannedWords />

      {/* 감정 분석 */}
      <SentimentAnalysis />
    </div>
  );
}
