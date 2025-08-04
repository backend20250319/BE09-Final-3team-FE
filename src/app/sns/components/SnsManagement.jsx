"use client";

import { useState } from "react";
import styles from "../styles/SnsManagement.module.css";
import Header from "./Header";
import TabNavigation from "./TabNavigation";
import ProfileCard from "./ProfileCard";
import StatsGrid from "./StatsGrid";
import ChartsSection from "./ChartsSection";
import TopPerformingPosts from "./TopPerformingPosts";
import EngagementDistribution from "./EngagementDistribution";

export default function SnsManagement() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <Header />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Profile Card */}
        <ProfileCard />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Charts Section */}
        <ChartsSection />

        {/* Follower Growth Chart */}
        <div className={styles.followerGrowthCard}>
          <h3>Follower Growth (Last 6 Months)</h3>
          <div className={styles.chartPlaceholder}>
            {/* Chart component would go here */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          {/* Top Performing Posts */}
          <TopPerformingPosts />

          {/* Engagement Distribution */}
          <EngagementDistribution />
        </div>
      </div>
    </div>
  );
}
