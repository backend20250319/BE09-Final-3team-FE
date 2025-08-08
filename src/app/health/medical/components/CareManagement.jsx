"use client";

import React, { useState } from "react";
import styles from "../styles/CareManagement.module.css";
import AddCareScheduleModal from "./AddCareScheduleModal";
import AddVaccinationScheduleModal from "./AddVaccinationScheduleModal";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import EditScheduleModal from "./EditScheduleModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import HealthCalendar from "../../components/HealthCalendar";
import {
  defaultCareSchedules,
  defaultVaccinationSchedules,
  careSubTypeOptions,
  vaccinationSubTypeOptions,
} from "../../data/mockData";

export default function CareManagement() {
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

  // 일정 상세 모달 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 필터링 상태
  const [careFilter, setCareFilter] = useState("전체");
  const [vaccinationFilter, setVaccinationFilter] = useState("전체");

  // 페이징 상태
  const [carePage, setCarePage] = useState(1);
  const [vaccinationPage, setVaccinationPage] = useState(1);
  const itemsPerPage = 3;

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

  // 필터링된 일정들
  const filteredCareSchedules = careSchedules.filter(
    (schedule) => careFilter === "전체" || schedule.subType === careFilter
  );
  const filteredVaccinationSchedules = vaccinationSchedules.filter(
    (schedule) =>
      vaccinationFilter === "전체" || schedule.subType === vaccinationFilter
  );

  // 페이징된 일정들
  const paginatedCareSchedules = filteredCareSchedules.slice(
    (carePage - 1) * itemsPerPage,
    carePage * itemsPerPage
  );
  const paginatedVaccinationSchedules = filteredVaccinationSchedules.slice(
    (vaccinationPage - 1) * itemsPerPage,
    vaccinationPage * itemsPerPage
  );

  // 페이징 핸들러
  const handleCarePageChange = (page) => {
    setCarePage(page);
  };

  const handleVaccinationPageChange = (page) => {
    setVaccinationPage(page);
  };

  // 캘린더 이벤트 구성 (돌봄/접종)
  const buildCalendarEvents = () => {
    const parseDateTime = (d, t) => {
      const [y, m, day] = d.split("-").map(Number);
      const [hh = 9, mm = 0] = (t || "09:00").split(":").map(Number);
      return new Date(y, m - 1, day, hh, mm, 0);
    };

    const careEvents = careSchedules.map((s) => ({
      id: `care-${s.id}`,
      title: `${s.icon} ${s.name}`,
      start: parseDateTime(s.date, s.scheduleTime),
      end: new Date(
        parseDateTime(s.date, s.scheduleTime).getTime() + 60 * 60 * 1000
      ),
      allDay: false,
      type: "care",
      schedule: s,
    }));

    const vacEvents = vaccinationSchedules.map((s) => ({
      id: `vac-${s.id}`,
      title: `${s.icon} ${s.name}`,
      start: parseDateTime(
        s.date || new Date().toISOString().slice(0, 10),
        s.scheduleTime
      ),
      end: new Date(
        parseDateTime(
          s.date || new Date().toISOString().slice(0, 10),
          s.scheduleTime
        ).getTime() +
          60 * 60 * 1000
      ),
      allDay: false,
      type: s.name === "건강검진" ? "checkup" : "vaccination",
      schedule: s,
    }));

    return [...careEvents, ...vacEvents];
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
    if (selectedSchedule) {
      setEditingSchedule(selectedSchedule);
      setEditingType(selectedSchedule.type === "돌봄" ? "care" : "vaccination");
      setShowDetailModal(false);
      setShowEditModal(true);
    }
  };

  const handleDetailModalDelete = () => {
    if (selectedSchedule) {
      requestDeleteSchedule(selectedSchedule.id, selectedSchedule.type);
      setShowDetailModal(false);
    }
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
          <p className={styles.scheduleTime}>{schedule.scheduleTime}</p>
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
          >
            {page === "..." ? "ㆍㆍㆍ" : page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 돌봄 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>돌봄</h3>
          <div className={styles.headerControls}>
            <select
              value={careFilter}
              onChange={(e) => {
                setCareFilter(e.target.value);
                setCarePage(1);
              }}
              className={styles.filterSelect}
            >
              <option value="전체">전체</option>
              {careSubTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              className={styles.addButton}
              onClick={handleAddCareSchedule}
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
        </div>

        <div className={styles.scheduleList}>
          {paginatedCareSchedules.map((schedule) =>
            renderScheduleCard(schedule, "돌봄")
          )}
        </div>

        {filteredCareSchedules.length > itemsPerPage &&
          renderPagination(
            carePage,
            Math.ceil(filteredCareSchedules.length / itemsPerPage),
            handleCarePageChange
          )}
      </div>

      {/* 접종 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>접종</h3>
          <div className={styles.headerControls}>
            <select
              value={vaccinationFilter}
              onChange={(e) => {
                setVaccinationFilter(e.target.value);
                setVaccinationPage(1);
              }}
              className={styles.filterSelect}
            >
              <option value="전체">전체</option>
              {vaccinationSubTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
        </div>

        <div className={styles.scheduleList}>
          {paginatedVaccinationSchedules.map((schedule) =>
            renderScheduleCard(schedule, "접종")
          )}
        </div>

        {filteredVaccinationSchedules.length > itemsPerPage &&
          renderPagination(
            vaccinationPage,
            Math.ceil(filteredVaccinationSchedules.length / itemsPerPage),
            handleVaccinationPageChange
          )}
      </div>

      {/* 캘린더 (목록 아래 위치) */}
      <HealthCalendar
        events={buildCalendarEvents()}
        onEventClick={handleCalendarEventClick}
      />

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

      {/* 일정 상세 모달 */}
      <ScheduleDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        schedule={selectedSchedule}
        onEdit={handleDetailModalEdit}
        onDelete={handleDetailModalDelete}
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
