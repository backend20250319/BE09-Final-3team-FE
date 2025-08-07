"use client";

import React from "react";
import styles from "../styles/MedicalNavTabs.module.css";

export default function MedicalNavTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.navSection}>
      <div className={styles.navTabs}>
        <button
          className={`${styles.navTab} ${
            activeTab === "투약" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("투약")}
        >
          투약
        </button>
        <button
          className={`${styles.navTab} ${
            activeTab === "돌봄 일정" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("돌봄 일정")}
        >
          돌봄 일정
        </button>
      </div>
    </div>
  );
}
