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
    },
    {
      id: 2,
      name: "오메가-3",
      type: "영양제",
      frequency: "하루에 한 번",
      icon: "💊",
      color: "#FFF3E0",
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
    // Add new medication logic
    console.log("Add medication clicked");
  };

  const handleEditMedication = (id) => {
    console.log("Edit medication:", id);
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
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
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1V15M1 8H15"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEditMedication(medication.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 7H13M7 1V13"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDeleteMedication(medication.id)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 7H13M7 1V13"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스케줄 캘린더 섹션 */}
      <div className={styles.calendarSection}>
        <h3>스케줄 캘린더</h3>
        <div className={styles.calendarPlaceholder}>
          <div className={styles.calendarIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect
                x="4"
                y="8"
                width="24"
                height="20"
                rx="2"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <path d="M4 12H28" stroke="#9CA3AF" strokeWidth="2" />
              <path
                d="M10 4V8"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M22 4V8"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p>
            Calendar view showing all scheduled medications and appointments
          </p>
        </div>
      </div>
    </div>
  );
}
