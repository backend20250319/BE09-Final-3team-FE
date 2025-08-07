"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import styles from "../styles/ActivityReport.module.css";

export default function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("일");

  const activityMetrics = [
    {
      id: 1,
      title: "산책 소모 칼로리",
      icon: "/health/footprint.png",
      colorActual: "#8BC34A",
      colorRecommended: "#AED581", // 연한 초록
      type: "bar",
      hasRecommended: true,
    },
    {
      id: 2,
      title: "섭취 칼로리",
      icon: "/health/meal.png",
      colorActual: "#F5A623",
      colorRecommended: "#F8C471", // 연한 주황
      type: "bar",
      hasRecommended: true,
    },
    {
      id: 3,
      title: "배변 횟수",
      icon: "/health/bathroom.png",
      colorActual: "#FF7675",
      colorRecommended: null,
      type: "line",
      hasRecommended: false,
    },
    {
      id: 4,
      title: "수면 시간",
      icon: "/health/sleep.png",
      colorActual: "#de74ffff",
      colorRecommended: null,
      type: "area",
      hasRecommended: false,
    },
  ];

  // 일별 데이터 예시
  const dailyData = {
    common: [
      {
        day: "월",
        actualValue: 85,
        recommendedValue: 100,
      },
      { day: "화", actualValue: 65, recommendedValue: 100 },
      { day: "수", actualValue: 45, recommendedValue: 100 },
      { day: "목", actualValue: 25, recommendedValue: 100 },
      { day: "금", actualValue: 20, recommendedValue: 100 },
      { day: "토", actualValue: 35, recommendedValue: 100 },
      { day: "일", actualValue: 30, recommendedValue: 100 },
    ],
    poop: [
      { day: "월", 소변: 3, 대변: 1 },
      { day: "화", 소변: 2, 대변: 1 },
      { day: "수", 소변: 4, 대변: 2 },
      { day: "목", 소변: 3, 대변: 1 },
      { day: "금", 소변: 2, 대변: 1 },
      { day: "토", 소변: 1, 대변: 1 },
      { day: "일", 소변: 3, 대변: 2 },
    ],
  };

  // 주별 데이터 예시
  const weeklyData = {
    common: [
      { week: "1주", actualValue: 450, recommendedValue: 500 },
      { week: "2주", actualValue: 500, recommendedValue: 500 },
      { week: "3주", actualValue: 480, recommendedValue: 500 },
      { week: "4주", actualValue: 520, recommendedValue: 500 },
    ],
    poop: [
      { week: "1주", 소변: 18, 대변: 7 },
      { week: "2주", 소변: 20, 대변: 8 },
      { week: "3주", 소변: 19, 대변: 9 },
      { week: "4주", 소변: 22, 대변: 7 },
    ],
  };

  // 월별 데이터 예시
  const monthlyData = {
    common: [
      { month: "1월", actualValue: 2000, recommendedValue: 2100 },
      { month: "2월", actualValue: 1900, recommendedValue: 2100 },
      { month: "3월", actualValue: 2100, recommendedValue: 2100 },
      { month: "4월", actualValue: 2200, recommendedValue: 2100 },
    ],
    poop: [
      { month: "1월", 소변: 80, 대변: 35 },
      { month: "2월", 소변: 70, 대변: 30 },
      { month: "3월", 소변: 75, 대변: 32 },
      { month: "4월", 소변: 85, 대변: 33 },
    ],
  };

  // 년별 데이터 예시
  const yearlyData = {
    common: [
      { year: "2022", actualValue: 24000, recommendedValue: 25000 },
      { year: "2023", actualValue: 25000, recommendedValue: 25000 },
      { year: "2024", actualValue: 26000, recommendedValue: 25000 },
    ],
    poop: [
      { year: "2022", 소변: 900, 대변: 400 },
      { year: "2023", 소변: 920, 대변: 410 },
      { year: "2024", 소변: 940, 대변: 420 },
    ],
  };

  // 선택된 기간에 따른 데이터와 x축 key 가져오기
  function getDataAndKey(metric) {
    switch (selectedPeriod) {
      case "일":
        return {
          data: metric.type === "line" ? dailyData.poop : dailyData.common,
          xKey: "day",
        };
      case "주":
        return {
          data: metric.type === "line" ? weeklyData.poop : weeklyData.common,
          xKey: "week",
        };
      case "월":
        return {
          data: metric.type === "line" ? monthlyData.poop : monthlyData.common,
          xKey: "month",
        };
      case "년":
        return {
          data: metric.type === "line" ? yearlyData.poop : yearlyData.common,
          xKey: "year",
        };
      default:
        return {
          data: metric.type === "line" ? dailyData.poop : dailyData.common,
          xKey: "day",
        };
    }
  }

  return (
    <section className={styles.activityReportSection}>
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

      <div className={styles.metricsGrid}>
        {activityMetrics.map((metric) => {
          const { data, xKey } = getDataAndKey(metric);

          return (
            <div key={metric.id} className={styles.metricCard}>
              <div className={styles.metricHeader}>
                <div className={styles.metricIcon}>
                  <img
                    src={metric.icon}
                    alt={metric.title}
                    width={24}
                    height={24}
                  />
                </div>
                <span className={styles.metricTitle}>{metric.title}</span>
              </div>

              <div
                className={`${styles.metricChart} ${
                  metric.title === "배변 횟수" ? styles.shiftChartLeft : ""
                }`}
              >
                {metric.type === "bar" && (
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={data}>
                      <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) =>
                          metric.title.includes("칼로리")
                            ? [`${value} kcal`, ""]
                            : metric.title === "수면 시간"
                            ? [`${value} 시간`, ""]
                            : [`${value}`, ""]
                        }
                      />
                      {/* 실제값 막대 */}
                      <Bar
                        dataKey="actualValue"
                        fill={metric.colorActual}
                        radius={[4, 4, 0, 0]}
                        barSize={15}
                        name="실제 값"
                      />
                      {/* 권장값 막대 */}
                      {metric.hasRecommended && (
                        <Bar
                          dataKey="recommendedValue"
                          fill={metric.colorRecommended}
                          radius={[4, 4, 0, 0]}
                          barSize={15}
                          name="권장 값"
                        />
                      )}
                      <Legend verticalAlign="bottom" height={36} />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {metric.type === "line" && (
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data}>
                      <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                      <Line
                        type="monotone"
                        dataKey="소변"
                        stroke="#42A5F5"
                        dot={{ r: 4 }}
                        name="소변"
                      />
                      <Line
                        type="monotone"
                        dataKey="대변"
                        stroke="#FF7043"
                        dot={{ r: 4 }}
                        name="대변"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {metric.type === "area" && (
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={data}>
                      <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip formatter={(value) => [`${value} 시간`, ""]} />
                      <Area
                        type="monotone"
                        dataKey="actualValue"
                        stroke={metric.colorActual}
                        fill={metric.colorActual}
                        name="수면 시간"
                        fillOpacity={0.3}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
