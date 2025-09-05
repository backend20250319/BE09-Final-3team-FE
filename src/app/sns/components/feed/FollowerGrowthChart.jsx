"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/feed/FollowerGrowthChart.module.css";
import { getFollowerData } from "../../lib/feedData";
import { useSns } from "../../context/SnsContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from "recharts";

export default function FollowerGrowthChart() {
  const [followerData, setFollowerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedInstagramProfile } = useSns();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedInstagramProfile?.id) {
          setFollowerData([]);
          return;
        }
        const rows = await getFollowerData(selectedInstagramProfile.id);
        setFollowerData(rows);
      } catch (error) {
        console.error("팔로워 데이터 로딩 실패:", error);
        setFollowerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedInstagramProfile]);

  if (loading) {
    return (
      <div className={styles.followerGrowthCard}>
        <h3 className={styles.chartTitle}>팔로워 성장 차트 (최근 6개월)</h3>
        <div style={{ padding: "2rem", textAlign: "center" }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.followerGrowthCard}>
      <h3 className={styles.chartTitle}>팔로워 성장 차트 (최근 6개월)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={followerData}>
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f5a623" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value.toLocaleString()}`)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name) => [
              name === "총 팔로워"
                ? value >= 1000
                  ? `${(value / 1000).toFixed(1)}K`
                  : `${value.toLocaleString()}`
                : value.toLocaleString(),
              name,
            ]}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="followers"
            stroke="#f5a623"
            fillOpacity={1}
            fill="url(#colorFollowers)"
            strokeWidth={2}
            name="총 팔로워"
          />
          <Bar
            yAxisId="right"
            dataKey="newFollowers"
            fill="#8bc34a"
            name="신규 팔로워"
            radius={[4, 4, 0, 0]}
            maxBarSize={20}
            fillOpacity={0.7}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
