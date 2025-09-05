"use client";

import Link from "next/link";
import { useCampaign } from "../context/CampaignContext";
import styles from "../styles/TabNavigation.module.css";

const tabs = [
  { key: "approved", label: "모집중인 광고" },
  { key: "closed", label: "모집 종료된 광고" },
  { key: "trial", label: "체험 기간 중인 광고" },
  { key: "ended", label: "종료된 광고" },
  { key: "pending", label: "승인 대기중인 광고" },
  { key: "rejected", label: "반려된 광고" }
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
        <div className={styles.registerButtonWrapper}>
          <Link href="/advertiser/ads-list/register">
            <button className={styles.registerButton}>
              캠페인 등록
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
