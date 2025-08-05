import styles from "../../styles/feed/FeedAnalysis.module.css";
import ProfileCard from "./ProfileCard";
import StatsGrid from "./StatsGrid";
import ChartsSection from "./ChartsSection";
import FollowerGrowthChart from "./FollowerGrowthChart";
import TopPerformingPosts from "./TopPerformingPosts";
import EngagementDistribution from "./EngagementDistribution";

export default function FeedAnalysis() {
  return (
    <>
      {/* Profile Card */}
      <ProfileCard />

      {/* Stats Grid */}
      <StatsGrid />

      {/* Charts Section */}
      <ChartsSection />

      {/* Follower Growth Chart */}
      <FollowerGrowthChart />

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* Top Performing Posts */}
        <TopPerformingPosts />

        {/* Engagement Distribution */}
        <EngagementDistribution />
      </div>
    </>
  );
}
