"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/feed/StatsGrid.module.css";
import { getFeedStats } from "../../lib/feedData";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await getFeedStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to fetch stats data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) {
    return <div className={styles.statsGrid}>Loading...</div>;
  }

  return (
    <div className={styles.statsGrid}>
      {statsData.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
