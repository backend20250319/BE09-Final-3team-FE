"use client";
import React, { useState, useEffect } from "react";
import styles from "../../styles/feed/StatsGrid.module.css";
import { getFeedStats } from "../../lib/feedData";
import StatCard from "./StatCard";
import StatsCards from "./StatsCards";
import { useSns } from "../../context/SnsContext";

export default function StatsGrid() {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedInstagramProfile } = useSns();

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        if (!selectedInstagramProfile?.id) {
          setStatsData([]);
          return;
        }

        const data = await getFeedStats(selectedInstagramProfile.id);
        setStatsData(data?.data || {});
        
      } catch (error) {
        console.error("Failed to fetch stats data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [selectedInstagramProfile]);

  if (loading) {
    return <div className={styles.statsGrid}>Loading...</div>;
  }

  return (
    <div className={styles.statsGrid}>
      <StatsCards data={statsData} />
    </div>
  );
}
