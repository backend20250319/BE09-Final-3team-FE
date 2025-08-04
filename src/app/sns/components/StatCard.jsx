import styles from "../styles/StatCard.module.css";

const StatIcon = ({ iconType, color }) => {
  const icons = {
    heart: (
      <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
        <path
          d="M20.84 3.15C20.3292 2.63937 19.7228 2.23621 19.0554 1.96377C18.3879 1.69134 17.6725 1.55421 16.95 1.55421C16.2275 1.55421 15.5121 1.69134 14.8446 1.96377C14.1772 2.23621 13.5708 2.63937 13.06 3.15L12 4.21L10.94 3.15C9.9083 2.11835 8.50903 1.55466 7.05 1.55466C5.59096 1.55466 4.19169 2.11835 3.16 3.15C2.12835 4.18166 1.56466 5.58093 1.56466 7.04C1.56466 8.49907 2.12835 9.89834 3.16 10.93L4.22 11.99L12 19.77L19.78 11.99L20.84 10.93C21.3506 10.4192 21.7538 9.81282 22.0262 9.14535C22.2987 8.47787 22.4358 7.76248 22.4358 7.04C22.4358 6.31752 22.2987 5.60213 22.0262 4.93465C21.7538 4.26718 21.3506 3.66081 20.84 3.15V3.15Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    comment: (
      <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
        <path
          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60568 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    engagement: (
      <svg width="24" height="21" viewBox="0 0 24 21" fill="none">
        <path
          d="M7 10L12 15L22 5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    reach: (
      <svg width="27" height="21" viewBox="0 0 27 21" fill="none">
        <path
          d="M1 12C1 12 5 4 13 4C21 4 25 12 25 12C25 12 21 20 13 20C5 20 1 12 1 12Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="13"
          cy="12"
          r="3"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return icons[iconType] || null;
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
