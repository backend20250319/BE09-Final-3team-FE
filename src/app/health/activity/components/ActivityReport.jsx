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
import {
  activityMetrics,
  actualNameMap,
  dailyData,
  weeklyData,
  monthlyData,
  yearlyData,
} from "../../data/mockData";

export default function ActivityReport() {
  const [selectedPeriod, setSelectedPeriod] = useState("일");

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

  // ✅ Tooltip 포맷 함수
  const customTooltipFormatter = (metricTitle) => (value, name) => {
    const labelMap = {
      "섭취 칼로리": {
        actualValue: "식사량",
        recommendedValue: "권장량",
      },
      "산책 소모 칼로리": {
        actualValue: "소모량",
        recommendedValue: "권장량",
      },
      "수면 시간": {
        actualValue: "수면",
      },
      "배변 횟수": {
        소변: "소변",
        대변: "대변",
      },
    };

    const unitMap = {
      "섭취 칼로리": "kcal",
      "산책 소모 칼로리": "kcal",
      "수면 시간": "시간",
      "배변 횟수": "회",
    };

    const label = labelMap[metricTitle]?.[name] || name;
    const unit = unitMap[metricTitle] || "";

    return [`${value} ${unit}`, label];
  };

  return (
    <section className={styles.activityReportSection}>
      <div className={styles.dateRangeContainer}>
        <div className={styles.dateRangeHeader}>
          <span className={styles.dateRangeLabel}></span>
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
                    <BarChart data={data} barCategoryGap="20%" barGap={4}>
                      <XAxis dataKey={xKey} tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip
                        formatter={customTooltipFormatter(metric.title)}
                      />
                      {/* 실제값 막대 - 앞쪽 */}
                      <Bar
                        dataKey="actualValue"
                        fill={metric.colorActual}
                        radius={[4, 4, 0, 0]}
                        barSize={15}
                        name={
                          metric.title === "산책 소모 칼로리"
                            ? "소모량"
                            : metric.title === "섭취 칼로리"
                            ? "식사량"
                            : "실제값"
                        }
                      />
                      {/* 권장량 막대 - 뒤쪽 */}
                      {metric.hasRecommended && (
                        <Bar
                          dataKey="recommendedValue"
                          fill={metric.colorRecommended}
                          radius={[4, 4, 0, 0]}
                          barSize={15}
                          name="권장량"
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
                        formatter={customTooltipFormatter(metric.title)}
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
                      <Tooltip
                        formatter={customTooltipFormatter(metric.title)}
                      />
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
