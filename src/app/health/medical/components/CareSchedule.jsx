"use client";

import React, { useState } from "react";
import styles from "../styles/CareSchedule.module.css";
import AddCareScheduleModal from "./AddCareScheduleModal";
import AddVaccinationScheduleModal from "./AddVaccinationScheduleModal"; // 접종용 모달 따로 만드셨다면
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import EditScheduleModal from "./EditScheduleModal";

export default function CareSchedule() {
  const defaultCareSchedules = [
    {
      id: 1,
      name: "산책",
      type: "돌봄",
      date: "2025-08-10",
      time: "15:00",
      frequency: "매일 오후 3시",
      icon: "🐕",
      color: "#E8F5E8",
      isNotified: true,
    },
    {
      id: 2,
      name: "미용",
      type: "돌봄",
      date: "2025-08-15",
      time: "13:00",
      frequency: "월 1회",
      icon: "✂️",
      color: "#FFF3E0",
      isNotified: false,
    },
    {
      id: 3,
      name: "생일",
      type: "돌봄",
      date: "2025-08-15",
      time: "00:00",
      frequency: "연 1회",
      icon: "🎂",
      color: "#FCE4EC",
      isNotified: true,
    },
  ];

  const defaultVaccinationSchedules = [
    {
      id: 4,
      name: "종합백신",
      type: "접종",
      date: "2025-09-01",
      time: "10:00",
      frequency: "연 1회",
      icon: "💉",
      color: "#E3F2FD",
      isNotified: true,
    },
    {
      id: 5,
      name: "광견병백신",
      type: "접종",
      date: "2025-09-02",
      time: "10:00",
      frequency: "연 1회",
      icon: "💉",
      color: "#E3F2FD",
      isNotified: false,
    },
    {
      id: 6,
      name: "건강검진",
      type: "접종",
      frequency: "반년 1회",
      icon: "🏥",
      color: "#F3E5F5",
      isNotified: true,
    },
  ];

  const [careSchedules, setCareSchedules] = useState(defaultCareSchedules);
  const [vaccinationSchedules, setVaccinationSchedules] = useState(
    defaultVaccinationSchedules
  );

  // showAddModal: false | "care" | "vaccination"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "돌봄" or "접종"
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingType, setEditingType] = useState(""); // "care" or "vaccination"

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive");
  const [showToast, setShowToast] = useState(false);

  // 돌봄 일정 추가 버튼 클릭
  const handleAddCareSchedule = () => {
    setShowAddModal("care");
  };

  // 접종 일정 추가 버튼 클릭
  const handleAddVaccinationSchedule = () => {
    setShowAddModal("vaccination");
  };

  const handleAddNewSchedule = (newSchedule) => {
    if (newSchedule.type === "돌봄") {
      setCareSchedules((prev) => [...prev, newSchedule]);
    } else {
      setVaccinationSchedules((prev) => [...prev, newSchedule]);
    }
    setToastMessage(`${newSchedule.name} 일정이 추가되었습니다.`);
    setToastType("active");
    setShowToast(true);
    setShowAddModal(false); // 모달 닫기
  };

  // (이하 생략, 원래 코드 그대로 유지)
  const handleEditSchedule = (id, type) => {
    let schedule;
    if (type === "돌봄") {
      schedule = careSchedules.find((s) => s.id === id);
      setEditingType("care");
    } else {
      schedule = vaccinationSchedules.find((s) => s.id === id);
      setEditingType("vaccination");
    }

    if (schedule) {
      setEditingSchedule(schedule);
      setShowEditModal(true);
    }
  };

  const handleEditScheduleSubmit = (updatedSchedule) => {
    if (editingType === "care") {
      setCareSchedules((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
      );
    } else {
      setVaccinationSchedules((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
      );
    }

    setToastMessage(`${updatedSchedule.name} 일정이 수정되었습니다.`);
    setToastType("active");
    setShowToast(true);
  };

  const toggleNotification = (id, type) => {
    if (type === "돌봄") {
      const updated = careSchedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isNotified: !schedule.isNotified }
          : schedule
      );
      setCareSchedules(updated);
      const updatedSchedule = updated.find((schedule) => schedule.id === id);
      setToastMessage(
        `${updatedSchedule.name} 알림이 ${
          updatedSchedule.isNotified ? "활성화" : "비활성화"
        } 되었습니다.`
      );
      setToastType(updatedSchedule.isNotified ? "active" : "inactive");
    } else {
      const updated = vaccinationSchedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isNotified: !schedule.isNotified }
          : schedule
      );
      setVaccinationSchedules(updated);
      const updatedSchedule = updated.find((schedule) => schedule.id === id);
      setToastMessage(
        `${updatedSchedule.name} 알림이 ${
          updatedSchedule.isNotified ? "활성화" : "비활성화"
        } 되었습니다.`
      );
      setToastType(updatedSchedule.isNotified ? "active" : "inactive");
    }
    setShowToast(true);
  };

  const requestDeleteSchedule = (id, type) => {
    setToDeleteId(id);
    setDeleteType(type);
    setShowConfirm(true);
  };

  const confirmDeleteSchedule = () => {
    if (toDeleteId == null) return;

    if (deleteType === "돌봄") {
      const updated = careSchedules.filter(
        (schedule) => schedule.id !== toDeleteId
      );
      setCareSchedules(updated);
    } else {
      const updated = vaccinationSchedules.filter(
        (schedule) => schedule.id !== toDeleteId
      );
      setVaccinationSchedules(updated);
    }

    setShowConfirm(false);
    setToDeleteId(null);
    setDeleteType("");
  };

  const cancelDeleteSchedule = () => {
    setShowConfirm(false);
    setToDeleteId(null);
    setDeleteType("");
  };

  const renderScheduleCard = (schedule, type) => (
    <div key={schedule.id} className={styles.scheduleCard}>
      <div className={styles.scheduleInfo}>
        <div
          className={styles.scheduleIcon}
          style={{ backgroundColor: schedule.color }}
        >
          {schedule.icon}
        </div>
        <div className={styles.scheduleDetails}>
          <h4>{schedule.name}</h4>
          <p>{schedule.frequency}</p>
        </div>
      </div>
      <div className={styles.scheduleActions}>
        <button
          className={styles.actionButton}
          onClick={() => handleEditSchedule(schedule.id, type)}
        >
          <img src="/health/note.png" alt="수정" width={22} height={22} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => requestDeleteSchedule(schedule.id, type)}
        >
          <img src="/health/trash.png" alt="삭제" width={24} height={24} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => toggleNotification(schedule.id, type)}
        >
          <img
            src={
              schedule.isNotified ? "/health/notifi.png" : "/health/notifi2.png"
            }
            alt="알림"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 돌봄 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>돌봄</h3>
          <button className={styles.addButton} onClick={handleAddCareSchedule}>
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

        <div className={styles.scheduleList}>
          {careSchedules.map((schedule) =>
            renderScheduleCard(schedule, "돌봄")
          )}
        </div>
      </div>

      {/* 접종 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>접종</h3>
          <button
            className={styles.addButton}
            onClick={handleAddVaccinationSchedule}
          >
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

        <div className={styles.scheduleList}>
          {vaccinationSchedules.map((schedule) =>
            renderScheduleCard(schedule, "접종")
          )}
        </div>
      </div>

      {/* 일정 추가 모달: 돌봄 */}
      {showAddModal === "care" && (
        <AddCareScheduleModal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNewSchedule}
        />
      )}

      {/* 일정 추가 모달: 접종 */}
      {showAddModal === "vaccination" && (
        <AddVaccinationScheduleModal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNewSchedule}
        />
      )}

      {/* 일정 수정 모달 */}
      <EditScheduleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSchedule(null);
          setEditingType("");
        }}
        onEdit={handleEditScheduleSubmit}
        scheduleData={editingSchedule}
        type={editingType}
      />

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <ConfirmModal
          message="일정을 삭제하시겠습니까?"
          onConfirm={confirmDeleteSchedule}
          onCancel={cancelDeleteSchedule}
        />
      )}

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
