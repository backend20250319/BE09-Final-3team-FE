"use client";

import { useState } from "react";
import styles from "../styles/ActivityReport.module.css";

export default function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("일");
  const [selectedTab, setSelectedTab] = useState("활동 관리");

  const activityMetrics = [
    {
      id: 1,
      title: "산책 소모 칼로리",
      icon: "🏃‍♂️",
      color: "#8BC34A",
    },
    {
      id: 2,
      title: "섭취 칼로리",
      icon: "🍽️",
      color: "#F5A623",
    },
    {
      id: 3,
      title: "배변 횟수",
      icon: "💩",
      color: "#FF7675",
    },
    {
      id: 4,
      title: "수면 시간",
      icon: "😴",
      color: "#8BC34A",
    },
  ];

  const chartData = [
    { day: "월", value: 85 },
    { day: "화", value: 65 },
    { day: "수", value: 45 },
    { day: "목", value: 25 },
    { day: "금", value: 20 },
    { day: "토", value: 35 },
    { day: "일", value: 30 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <section className={styles.activityReportSection}>
      {/* 날짜 필터 */}
      <div className={styles.dateRangeContainer}>
        <div className={styles.dateRangeHeader}>
          <span className={styles.dateRangeLabel}>Date Range:</span>
          <div className={styles.periodButtons}>
            {["일", "주", "월", "년"].map((period) => (
              <button
                key={period}
                className={`${styles.periodButton} ${
                  selectedPeriod === period ? styles.active : ""
                }`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 리포트 카드 */}
      <div className={styles.metricsGrid}>
        {activityMetrics.map((metric) => (
          <div key={metric.id} className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <div
                className={styles.metricIcon}
                style={{ color: metric.color }}
              >
                {metric.icon}
              </div>
              <span className={styles.metricTitle}>{metric.title}</span>
            </div>
            <div className={styles.metricChart}>
              <div className={styles.chartPlaceholder}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
