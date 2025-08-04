import styles from "../styles/StatsCard.module.css";

const StatIcon = ({ iconType, color }) => {
  const icons = {
    message: (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
        <path
          d="M18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z"
          fill={color}
        />
      </svg>
    ),
    delete: (
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
        <path
          d="M1 4V14C1 15.1 1.9 16 3 16H11C12.1 16 13 15.1 13 14V4H1ZM3.5 6H4.5V14H3.5V6ZM6.5 6H7.5V14H6.5V6ZM9.5 6H10.5V14H9.5V6ZM2 2V0.5C2 0.2 2.2 0 2.5 0H11.5C11.8 0 12 0.2 12 0.5V2H14V3H0V2H2Z"
          fill={color}
        />
      </svg>
    ),
    percentage: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 0C3.88 0 5 1.12 5 2.5S3.88 5 2.5 5S0 3.88 0 2.5S1.12 0 2.5 0ZM13.5 11C12.12 11 11 12.12 11 13.5S12.12 16 13.5 16S16 14.88 16 13.5S14.88 11 13.5 11ZM15.71 0.29C15.32 -0.1 14.68 -0.1 14.29 0.29L0.29 14.29C-0.1 14.68 -0.1 15.32 0.29 15.71C0.68 16.1 1.32 16.1 1.71 15.71L15.71 1.71C16.1 1.32 16.1 0.68 15.71 0.29Z"
          fill={color}
        />
      </svg>
    ),
    ban: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM12.5 4.5L11.5 3.5L8 7L4.5 3.5L3.5 4.5L7 8L3.5 11.5L4.5 12.5L8 9L11.5 12.5L12.5 11.5L9 8L12.5 4.5Z"
          fill={color}
        />
      </svg>
    ),
  };

  return icons[iconType] || null;
};

export default function StatsCard({ icon, label, value, color, bgColor, borderColor }) {
  return (
    <div
      className={styles.statCard}
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}CC 100%)`,
        borderColor: borderColor,
      }}
    >
      <div className={styles.statHeader}>
        <div className={styles.iconContainer}>
          <StatIcon iconType={icon} color={color} />
        </div>
        <div className={styles.statLabel} style={{ color: color }}>
          {label}
        </div>
      </div>
      <div className={styles.statValue} style={{ color: color }}>
        {value}
      </div>
    </div>
  );
}
