"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/MedicationManagement.module.css";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import AddMedicationModal from "./AddMedicationModal";

export default function MedicationManagement() {
  const LOCAL_STORAGE_KEY = "medication_notifications";

  const defaultMedications = [
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
  ];

  const [medications, setMedications] = useState(defaultMedications);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive"); // "active" or "inactive"
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const savedStatus = JSON.parse(saved);
        const updatedMedications = defaultMedications.map((med) => ({
          ...med,
          isNotified: savedStatus[med.id] ?? med.isNotified,
        }));
        setMedications(updatedMedications);
      } catch (e) {
        console.error("알림 상태 복원 실패:", e);
      }
    }
  }, []);

  const toggleNotification = (id) => {
    const updated = medications.map((med) =>
      med.id === id ? { ...med, isNotified: !med.isNotified } : med
    );
    setMedications(updated);

    const updatedStatus = updated.reduce((acc, med) => {
      acc[med.id] = med.isNotified;
      return acc;
    }, {});
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStatus));

    const updatedMed = updated.find((med) => med.id === id);
    setToastMessage(
      `${updatedMed.name} 일정 알림이 ${
        updatedMed.isNotified ? "활성화" : "비활성화"
      } 되었습니다.`
    );
    setToastType(updatedMed.isNotified ? "active" : "inactive");
    setShowToast(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
    }
  };

  const handleAddMedication = () => {
    setShowAddModal(true);
  };

  const handleAddNewMedication = (newMedication) => {
    setMedications((prev) => [...prev, newMedication]);
    setToastMessage(`${newMedication.name}이 추가되었습니다.`);
    setToastType("active");
    setShowToast(true);
  };

  const handleEditMedication = (id) => {
    console.log("Edit medication:", id);
  };

  // 삭제 요청시 모달 띄우기
  const requestDeleteMedication = (id) => {
    setToDeleteId(id);
    setShowConfirm(true);
  };

  // 모달에서 확인 시 실제 삭제 처리
  const confirmDeleteMedication = () => {
    if (toDeleteId == null) return;
    const updated = medications.filter((med) => med.id !== toDeleteId);
    setMedications(updated);

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      delete parsed[toDeleteId];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    setShowConfirm(false);
    setToDeleteId(null);
  };

  // 모달에서 취소 시 모달 닫기
  const cancelDeleteMedication = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  return (
    <div className={styles.container}>
      {/* 처방전 사진 업로드 */}
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

      {/* 복용약 및 영양제 */}
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
                  onClick={() => requestDeleteMedication(medication.id)}
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
                  onClick={() => toggleNotification(medication.id)}
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

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <ConfirmModal
          message="일정을 삭제하시겠습니까?"
          onConfirm={confirmDeleteMedication}
          onCancel={cancelDeleteMedication}
        />
      )}

      {/* 약 추가 모달 */}
      <AddMedicationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddNewMedication}
      />

      {/* 토스트 메시지 */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={1000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
