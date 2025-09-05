"use client";

import styles from "../styles/TabNavigation.module.css";
import { useCampaign } from "../context/CampaignContext";

const tabs = [
  { key: "recruiting", label: "모집중인 체험단 상품" },
  { key: "ended", label: "종료된 체험단 상품" },
  { key: "applied", label: "신청한 체험단 상품" },
];

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useCampaign();

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabGroup}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.tab} ${activeTab === key ? styles.active : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
