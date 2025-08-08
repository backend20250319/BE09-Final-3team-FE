"use client";

import React, { useState } from "react";
import styles from "../styles/MedicationManagement.module.css";

export default function MedicationManagement() {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "오메가 1.5mg",
      type: "항생제",
      frequency: "하루에 두 번",
      icon: "💊",
      color: "#E3F2FD",
      isNotified: false,
    },
    {
      id: 2,
      name: "오메가-3",
      type: "영양제",
      frequency: "하루에 한 번",
      icon: "💊",
      color: "#FFF3E0",
      isNotified: true,
    },
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      // Handle file upload logic here
    }
  };

  const handleAddMedication = () => {
    console.log("Add medication clicked");
  };

  const handleEditMedication = (id) => {
    console.log("Edit medication:", id);
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const handleToggleNotification = (id) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, isNotified: !med.isNotified } : med
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* 처방전 사진 업로드 섹션 */}
      <div className={styles.prescriptionSection}>
        <div className={styles.uploadArea}>
          <div className={styles.uploadIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L10 18M2 10L18 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className={styles.uploadText}>
            <h3>처방전 사진</h3>
            <p>받으신 처방전 이미지를 업로드 해주세요!</p>
          </div>
          <label className={styles.uploadButton}>
            파일 업로드
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* 복용약 및 영양제 섹션 */}
      <div className={styles.medicationSection}>
        <div className={styles.sectionHeader}>
          <h3>복용약 및 영양제</h3>
          <button className={styles.addButton} onClick={handleAddMedication}>
            <span>추가</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1V13M1 7H13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.medicationList}>
          {medications.map((medication) => (
            <div key={medication.id} className={styles.medicationCard}>
              <div className={styles.medicationInfo}>
                <div
                  className={styles.medicationIcon}
                  style={{ backgroundColor: medication.color }}
                >
                  {medication.icon}
                </div>
                <div className={styles.medicationDetails}>
                  <h4>{medication.name}</h4>
                  <p>
                    {medication.type} • {medication.frequency}
                  </p>
                </div>
              </div>
              <div className={styles.medicationActions}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEditMedication(medication.id)}
                >
                  <img
                    src="/health/note.png"
                    alt="수정"
                    width={22}
                    height={22}
                  />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDeleteMedication(medication.id)}
                >
                  <img
                    src="/health/trash.png"
                    alt="삭제"
                    width={24}
                    height={24}
                  />
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleToggleNotification(medication.id)}
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
          ))}
        </div>
      </div>

      {/* 스케줄 캘린더 섹션 */}
      {/* <CalendarSchedule /> */}
    </div>
  );
}
