import styles from "../styles/StatsGrid.module.css";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const statsData = [
    {
      id: 1,
      value: "8,247",
      label: "Avg Likes per Post",
      change: "+12.5%",
      iconType: "heart",
      borderColor: "#F5A623",
    },
    {
      id: 2,
      value: "342",
      label: "Avg Comments per Post",
      change: "+8.3%",
      iconType: "comment",
      borderColor: "#8BC34A",
    },
    {
      id: 3,
      value: "3.4%",
      label: "Engagement Rate",
      change: "+15.7%",
      iconType: "engagement",
      borderColor: "#FF7675",
    },
    {
      id: 4,
      value: "156.8K",
      label: "Avg Reach per Post",
      change: "+22.1%",
      iconType: "reach",
      borderColor: "#60A5FA",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {statsData.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
