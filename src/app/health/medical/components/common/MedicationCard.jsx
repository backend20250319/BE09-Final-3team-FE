"use client";

import React from "react";
import styles from "../../styles/MedicationManagement.module.css";
import { COLOR_MAP } from "../../../constants/colors";
import { MEDICATION_LABELS } from "../../../constants";

export default function MedicationCard({
  medication,
  onEdit,
  onDelete,
  onToggleNotification,
}) {
  const getNotificationTooltip = () => {
    if (!medication.isNotified) {
      return `알림 비활성화 (마지막 설정: ${
        medication.lastReminderDaysBefore || 0
      }일전)`;
    } else {
      return medication.reminderDaysBefore === 0
        ? "당일 알림"
        : `${medication.reminderDaysBefore}일 전 알림`;
    }
  };

  return (
    <div className={styles.medicationCard}>
      <div className={styles.medicationInfo}>
        <div
          className={styles.medicationIcon}
          style={{
            backgroundColor: COLOR_MAP[medication.type] || "#e8f5e8",
          }}
        >
          {medication.icon}
        </div>
        <div className={styles.medicationDetails}>
          <div className={styles.medicationHeader}>
            <h4>{medication.name}</h4>
            {medication.isPrescription && (
              <span className={styles.prescriptionBadge}>
                {MEDICATION_LABELS.PRESCRIPTION_BADGE}
              </span>
            )}
          </div>
          <p>
            {medication.type} • {medication.frequency}
          </p>
          <p className={styles.scheduleTime}>{medication.scheduleTime}</p>
        </div>
      </div>
      <div className={styles.medicationActions}>
        <button
          className={styles.actionButton}
          onClick={() => onEdit(medication.id)}
        >
          <img
            src="/health/note.png"
            alt={MEDICATION_LABELS.EDIT}
            width={22}
            height={22}
          />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => onDelete(medication.id)}
        >
          <img
            src="/health/trash.png"
            alt={MEDICATION_LABELS.DELETE}
            width={24}
            height={24}
          />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => onToggleNotification(medication.id)}
          title={getNotificationTooltip()}
        >
          <img
            src={
              medication.isNotified
                ? "/health/notifi.png"
                : "/health/notifi2.png"
            }
            alt="알림"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
