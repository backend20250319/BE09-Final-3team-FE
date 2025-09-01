import styles from "../../styles/feed/StatCard.module.css";
import { FaRegHeart, FaRegComment, FaChartLine, FaEye, FaTrophy, FaComments } from "react-icons/fa";

const StatIcon = ({ iconType, color }) => {
  const IconMap = {
    heart: FaRegHeart,
    comment: FaRegComment,
    engagement: FaChartLine,
    reach: FaEye,
    trophy: FaTrophy,
    comments: FaComments,
  };
  const Icon = IconMap[iconType];
  return Icon ? <Icon color={color} size={24} /> : null;
};

export default function StatCard({
  value,
  label,
  change,
  iconType,
  borderColor,
}) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: borderColor }}>
      <div className={styles.statHeader}>
        <div className={styles.iconContainer}>
          <StatIcon iconType={iconType} color={borderColor} />
        </div>
        <div className={styles.changeIndicator}>{change}</div>
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
