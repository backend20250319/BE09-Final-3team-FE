"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/MedicationManagement.module.css";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import AddMedicationModal from "./AddMedicationModal";
import EditScheduleModal from "./EditScheduleModal";
import PrescriptionResultModal from "./PrescriptionResultModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import HealthCalendar from "../../components/HealthCalendar";
import {
  defaultMedications,
  STORAGE_KEYS,
  mockPrescriptionData,
  defaultCareSchedules,
  defaultVaccinationSchedules,
} from "../../data/mockData";

export default function MedicationManagement() {
  const LOCAL_STORAGE_KEY = STORAGE_KEYS.MEDICATION_NOTIFICATIONS;

  const [medications, setMedications] = useState(defaultMedications);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive");
  const [showToast, setShowToast] = useState(false);

  // OCR 결과 모달 상태
  const [showResultModal, setShowResultModal] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // 일정 상세 모달 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 페이징 상태
  const [medicationPage, setMedicationPage] = useState(1);
  const itemsPerPage = 3;

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
      setOcrResult(mockPrescriptionData);
      setShowResultModal(true);
    }
  };

  const handleAddMedication = () => setShowAddModal(true);

  const handleAddNewMedication = (newMedication) => {
    setMedications((prev) => [...prev, newMedication]);
    setToastMessage(`${newMedication.name}이(가) 추가되었습니다.`);
    setToastType("active");
    setShowToast(true);
  };

  const handleEditMedication = (id) => {
    const medication = medications.find((med) => med.id === id);
    if (medication) {
      setEditingMedication(medication);
      setShowEditModal(true);
    }
  };

  const handleEditMedicationSubmit = (updatedMedication) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === updatedMedication.id ? updatedMedication : med
      )
    );
    setToastMessage(`${updatedMedication.name}이(가) 수정되었습니다.`);
    setToastType("active");
    setShowToast(true);
  };

  const requestDeleteMedication = (id) => {
    setToDeleteId(id);
    setShowConfirm(true);
  };

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

  const cancelDeleteMedication = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  // 페이징된 투약 목록
  const paginatedMedications = medications.slice(
    (medicationPage - 1) * itemsPerPage,
    medicationPage * itemsPerPage
  );

  // 페이징 핸들러
  const handleMedicationPageChange = (page) => {
    setMedicationPage(page);
  };

  // 페이징 렌더링
  const renderPagination = (currentPage, totalPages, onPageChange) => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return (
      <div className={styles.pagination}>
        {pages.map((page, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.activePage : ""
            }`}
            onClick={() => page !== "..." && onPageChange(page)}
            disabled={page === "..."}
          ></button>
        ))}
      </div>
    );
  };

  // 특정 날짜와 "HH:MM" 문자열로 Date 만들기
  const dateAtTime = (baseDate, hm) => {
    const [hh = 9, mm = 0] = (hm || "09:00")
      .split(":")
      .map((n) => parseInt(n.trim(), 10));
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hh,
      mm,
      0
    );
  };

  // 캘린더 이벤트 구성 (투약 + 돌봄 + 접종 모두 포함)
  const buildCalendarEvents = () => {
    const events = [];

    // 1) 투약: 기간 동안 매일, scheduleTime(콤마 구분) 각각 이벤트 생성
    medications.forEach((med) => {
      if (med.startDate && med.endDate) {
        const start = new Date(med.startDate);
        const end = new Date(med.endDate);
        const times = (med.scheduleTime || "09:00")
          .split(",")
          .map((t) => t.trim());
        const current = new Date(start);
        while (current <= end) {
          times.forEach((hm) => {
            const s = dateAtTime(current, hm);
            const e = new Date(s.getTime() + 60 * 60 * 1000);
            events.push({
              id: `med-${med.id}-${current.toISOString().slice(0, 10)}-${hm}`,
              title: `${med.icon || "💊"} ${med.name}`,
              start: s,
              end: e,
              allDay: false,
              type: "medication",
              schedule: { ...med, category: "medication" },
            });
          });
          current.setDate(current.getDate() + 1);
        }
      }
    });

    // 2) 돌봄 일정
    defaultCareSchedules.forEach((s) => {
      if (!s.date) return;
      const base = new Date(s.date);
      const sTime = dateAtTime(base, s.scheduleTime || "09:00");
      const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
      events.push({
        id: `care-${s.id}`,
        title: `${s.icon || "🐕"} ${s.name}`,
        start: sTime,
        end: eTime,
        allDay: false,
        type: "care",
        schedule: { ...s, category: "care" },
      });
    });

    // 3) 접종 일정
    defaultVaccinationSchedules.forEach((s) => {
      const dateStr = s.date || new Date().toISOString().slice(0, 10);
      const base = new Date(dateStr);
      const sTime = dateAtTime(base, s.scheduleTime || "10:00");
      const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
      events.push({
        id: `vac-${s.id}`,
        title: `${s.icon || "💉"} ${s.name}`,
        start: sTime,
        end: eTime,
        allDay: false,
        type: s.subType === "건강검진" ? "checkup" : "vaccination",
        schedule: {
          ...s,
          category: s.subType === "건강검진" ? "checkup" : "vaccination",
        },
      });
    });

    return events;
  };

  // 캘린더 이벤트 클릭 핸들러
  const handleCalendarEventClick = (event) => {
    if (event.schedule) {
      setSelectedSchedule(event.schedule);
      setShowDetailModal(true);
    }
  };

  // 일정 상세 모달 핸들러
  const handleDetailModalEdit = () => {
    if (selectedSchedule && selectedSchedule.category === "medication") {
      setEditingMedication(selectedSchedule);
      setShowDetailModal(false);
      setShowEditModal(true);
    } else {
      setShowDetailModal(false);
    }
  };

  const handleDetailModalDelete = () => {
    if (selectedSchedule && selectedSchedule.category === "medication") {
      requestDeleteMedication(selectedSchedule.id);
    }
    setShowDetailModal(false);
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
            <img
              src="health/pill.png"
              alt="복용약 추가 아이콘"
              width="17"
              height="17"
              className={styles.icon}
            />
          </button>
        </div>

        <div className={styles.medicationList}>
          {paginatedMedications.map((medication) => (
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
                  <p className={styles.scheduleTime}>
                    {medication.scheduleTime}
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

        {/* 페이징 */}
        {medications.length > itemsPerPage &&
          renderPagination(
            medicationPage,
            Math.ceil(medications.length / itemsPerPage),
            handleMedicationPageChange
          )}
      </div>

      {/* 캘린더 */}
      <HealthCalendar
        events={buildCalendarEvents()}
        onEventClick={handleCalendarEventClick}
      />

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

      {/* 약 수정 모달 */}
      <EditScheduleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingMedication(null);
        }}
        onEdit={handleEditMedicationSubmit}
        scheduleData={editingMedication}
        type="medication"
      />

      {/* 결과 모달 */}
      <PrescriptionResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        prescriptionData={ocrResult}
      />

      {/* 일정 상세 모달 */}
      <ScheduleDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        schedule={selectedSchedule}
        onEdit={handleDetailModalEdit}
        onDelete={handleDetailModalDelete}
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
