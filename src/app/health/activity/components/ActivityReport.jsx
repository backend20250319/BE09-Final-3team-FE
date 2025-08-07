"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
} from "recharts";
import styles from "../styles/ActivityReport.module.css";

export default function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("일");

  // 차트 타입 추가 & 각 차트에 맞는 color
  const activityMetrics = [
    {
      id: 1,
      title: "산책 소모 칼로리",
      icon: "🏃‍♂️",
      color: "#8BC34A",
      type: "bar",
    },
    {
      id: 2,
      title: "섭취 칼로리",
      icon: "🍽️",
      color: "#F5A623",
      type: "area",
    },
    {
      id: 3,
      title: "배변 횟수",
      icon: "💩",
      color: "#FF7675",
      type: "line",
    },
    {
      id: 4,
      title: "수면 시간",
      icon: "😴",
      color: "#8BC34A",
      type: "area",
    },
  ];

  // 산책 소모 칼로리, 섭취 칼로리, 수면 시간 공통 데이터
  const commonData = [
    { day: "월", value: 85 },
    { day: "화", value: 65 },
    { day: "수", value: 45 },
    { day: "목", value: 25 },
    { day: "금", value: 20 },
    { day: "토", value: 35 },
    { day: "일", value: 30 },
  ];

  // 배변 횟수 데이터 (소변, 대변 분리)
  const poopData = [
    { day: "월", 소변: 3, 대변: 1 },
    { day: "화", 소변: 2, 대변: 1 },
    { day: "수", 소변: 4, 대변: 2 },
    { day: "목", 소변: 3, 대변: 1 },
    { day: "금", 소변: 2, 대변: 1 },
    { day: "토", 소변: 1, 대변: 1 },
    { day: "일", 소변: 3, 대변: 2 },
  ];

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
              {metric.type === "bar" && (
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={commonData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={metric.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {metric.type === "area" && (
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={commonData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={metric.color}
                      fill={metric.color}
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {metric.type === "line" && (
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={poopData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="소변"
                      stroke="#42A5F5"
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="대변"
                      stroke="#FF7043"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
