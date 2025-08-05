import styles from "../styles/TabNavigation.module.css";
import { useSns } from "../context/SnsContext";

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useSns();

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
            activeTab === "comment" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("comment")}
        >
          댓글 관리
        </button>
      </div>
    </div>
  );
}
