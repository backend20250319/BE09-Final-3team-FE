"use client";

import { useState, useEffect } from "react";
import { getCommentStats } from "../../lib/commentData";
import styles from "../../styles/comment/CommentAnalytics.module.css";
import StatsCard from "./StatsCard";
import BannedWords from "./BannedWords";
import SentimentAnalysis from "./SentimentAnalysis";

export default function CommentAnalytics() {
  const [autoManageEnabled, setAutoManageEnabled] = useState(true);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await getCommentStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch comment stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) {
    return <div className={styles.analyticsSection}>Loading...</div>;
  }

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
