"use client";
import { useState, useEffect } from "react";
import styles from "../../styles/feed/ChartsSection.module.css";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// monthlyData: [{ month: "YYYY-MM-01", shares: "0", likes: "0", comments: "0", views: "0", reach: "0" }, ...]
import { useSns } from "../../context/SnsContext";
import { getEngagementAndReachData } from "../../lib/feedData";

export default function ChartsSection() {
  const [engagementData, setEngagementData] = useState([]);
  const [reachData, setReachData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedInstagramProfile } = useSns();

  useEffect(() => {
    const load = async () => {
      try {
        if (!selectedInstagramProfile?.id) {
          setEngagementData([]);
          setReachData([]);
          return;
        }
        const resp = await getEngagementAndReachData(selectedInstagramProfile.id);
        const monthly = resp?.data || resp?.monthly || resp || [];
        const normalized = Array.isArray(monthly)
          ? monthly.map((row) => ({
              month: typeof row.month === "string" ? row.month.slice(0, 7) : row.month,
              likes: Number(row.likes) || 0,
              comments: Number(row.comments) || 0,
              shares: Number(row.shares) || 0,
              views: Number(row.views) || 0,
              reach: Number(row.reach) || 0,
            }))
          : [];

        setEngagementData(normalized.map(({ month, likes, comments, shares }) => ({ month, likes, comments, shares })));
        setReachData(normalized.map(({ month, reach, views }) => ({ month, reach, views })));
      } catch (e) {
        console.error("월별 데이터 로딩 실패", e);
        setEngagementData([]);
        setReachData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedInstagramProfile]);

  if (loading) {
    return (
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <div style={{ padding: "2rem", textAlign: "center" }}>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartsSection}>
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>참여도 분석</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={engagementData}>
            <defs>
              <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f5a623" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f5a623" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8bc34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8bc34a" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="sharesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
            <Legend />
            <Area type="monotone" dataKey="likes" stackId="1" stroke="#f5a623" strokeWidth={2} fill="url(#likesGradient)" name="좋아요" dot={{ fill: "#f5a623", strokeWidth: 2, r: 4 }} />
            <Area type="monotone" dataKey="comments" stackId="2" stroke="#8bc34a" strokeWidth={2} fill="url(#commentsGradient)" name="댓글" dot={{ fill: "#8bc34a", strokeWidth: 2, r: 4 }} />
            <Area type="monotone" dataKey="shares" stackId="3" stroke="#60a5fa" strokeWidth={2} fill="url(#sharesGradient)" name="공유" dot={{ fill: "#60a5fa", strokeWidth: 2, r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>도달/조회 분석</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={reachData}>
            <defs>
              <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7675" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff7675" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6c5ce7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6c5ce7" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={{ stroke: "#e5e7eb" }} />
            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }} />
            <Legend />
            <Area type="monotone" dataKey="reach" stackId="1" stroke="#ff7675" strokeWidth={2} fill="url(#reachGradient)" name="도달수" dot={{ fill: "#ff7675", strokeWidth: 2, r: 4 }} />
            <Area type="monotone" dataKey="views" stackId="2" stroke="#6c5ce7" strokeWidth={2} fill="url(#viewsGradient)" name="조회수" dot={{ fill: "#6c5ce7", strokeWidth: 2, r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
