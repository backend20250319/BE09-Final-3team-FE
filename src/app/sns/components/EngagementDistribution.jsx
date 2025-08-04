import styles from "../styles/EngagementDistribution.module.css";

export default function EngagementDistribution() {
  return (
    <div className={styles.engagementCard}>
      <h3 className={styles.title}>Engagement Distribution</h3>
      <div className={styles.chartContainer}>
        {/* Chart component would go here */}
        <div className={styles.chartMockup}>
          <div className={styles.pieChart}>
            <div
              className={styles.pieSlice}
              style={{ "--color": "#F5A623", "--percentage": "45%" }}
            ></div>
            <div
              className={styles.pieSlice}
              style={{ "--color": "#8BC34A", "--percentage": "30%" }}
            ></div>
            <div
              className={styles.pieSlice}
              style={{ "--color": "#FF7675", "--percentage": "25%" }}
            ></div>
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#F5A623" }}
              ></div>
              <span>Likes (45%)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#8BC34A" }}
              ></div>
              <span>Comments (30%)</span>
            </div>
            <div className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: "#FF7675" }}
              ></div>
              <span>Shares (25%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
