import styles from "../styles/TabNavigation.module.css";

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabGroup}>
        <button
          className={`${styles.tab} ${
            activeTab === "feed" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("feed")}
        >
          피드 통계
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "comments" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("comments")}
        >
          댓글 관리
        </button>
      </div>
    </div>
  );
}
