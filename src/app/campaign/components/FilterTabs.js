"use client";

import { useState } from "react";
import styles from "../styles/FilterTabs.module.css";

export default function FilterTabs() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "전체 상품", active: true },
    { id: "recruiting", label: "모집중인 체험단 상품", active: false },
    { id: "ended", label: "종료된 체험단 상품", active: false },
    { id: "applied", label: "신청한 체험단 상품", active: false },
  ];

  return (
    <section className={styles.filterTabs}>
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}
