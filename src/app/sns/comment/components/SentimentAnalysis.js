import styles from "../styles/SentimentAnalysis.module.css";

export default function SentimentAnalysis() {
  const sentimentData = [
    {
      type: "긍정",
      percentage: "64%",
      color: "#16A34A",
      bgColor: "#DCFCE7",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke="#16A34A"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 11C7 11 8.5 13 10 13C11.5 13 13 11 13 11"
            stroke="#16A34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M8 8H8.01"
            stroke="#16A34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8H12.01"
            stroke="#16A34A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      type: "중립",
      percentage: "28%",
      color: "#4B5563",
      bgColor: "#F3F4F6",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke="#4B5563"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M8 8H8.01"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8H12.01"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12H12"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      type: "부정",
      percentage: "8%",
      color: "#DC2626",
      bgColor: "#FEE2E2",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke="#DC2626"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M7 13C7 13 8.5 11 10 11C11.5 11 13 13 13 13"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M8 8H8.01"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8H12.01"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.sentimentSection}>
      <h3 className={styles.title}>댓글 감정 분석 비율</h3>

      <div className={styles.sentimentGrid}>
        {sentimentData.map((sentiment, index) => (
          <div key={index} className={styles.sentimentCard}>
            <div className={styles.iconContainer} style={{ backgroundColor: sentiment.bgColor }}>
              {sentiment.icon}
            </div>
            <div className={styles.percentageContainer}>
              <div className={styles.percentage} style={{ color: sentiment.color }}>
                {sentiment.percentage}
              </div>
            </div>
            <div className={styles.labelContainer}>
              <div className={styles.label}>{sentiment.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
