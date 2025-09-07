"use client";

import React from "react";
import {
  MEDICATION_LABELS,
  CARE_LABELS,
  VACCINATION_LABELS,
} from "../../../constants";
import styles from "../../styles/MedicationManagement.module.css";

export default function EmptyState({
  type,
  icon,
  title,
  description,
  className,
}) {
  const getDefaultContent = () => {
    switch (type) {
      case "medication":
        return {
          icon: "💊",
          title: MEDICATION_LABELS.NO_MEDICATIONS,
          description: MEDICATION_LABELS.NO_MEDICATIONS_DESC,
        };
      case "care":
        return {
          icon: "🐕",
          title: CARE_LABELS.NO_SCHEDULES,
          description: CARE_LABELS.NO_SCHEDULES_DESC,
        };
      case "vaccination":
        return {
          icon: "💉",
          title: VACCINATION_LABELS.NO_SCHEDULES,
          description: VACCINATION_LABELS.NO_SCHEDULES_DESC,
        };
      default:
        return {
          icon: "📅",
          title: "등록된 일정이 없습니다.",
          description: "새로운 일정을 추가해보세요!",
        };
    }
  };

  const content = getDefaultContent();
  const displayIcon = icon || content.icon;
  const displayTitle = title || content.title;
  const displayDescription = description || content.description;

  return (
    <div className={`${styles.emptyState} ${className || ""}`}>
      <div className={styles.emptyIcon}>{displayIcon}</div>
      <p className={styles.emptyTitle}>{displayTitle}</p>
      <p className={styles.emptyDescription}>{displayDescription}</p>
    </div>
  );
}
