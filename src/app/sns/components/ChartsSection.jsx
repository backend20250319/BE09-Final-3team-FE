import styles from "../styles/ChartsSection.module.css";

export default function ChartsSection() {
  return (
    <div className={styles.chartsSection}>
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Likes Trend (Last 30 Days)</h3>
        <div className={styles.chartPlaceholder}>
          {/* Chart component would go here */}
          <div className={styles.chartMockup}>
            <div className={styles.chartLine}></div>
            <div className={styles.chartArea}></div>
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Comments Trend (Last 30 Days)</h3>
        <div className={styles.chartPlaceholder}>
          {/* Chart component would go here */}
          <div className={styles.chartMockup}>
            <div className={styles.chartLine}></div>
            <div className={styles.chartArea}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
