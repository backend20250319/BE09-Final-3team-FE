"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/CareManagement.module.css";
import AddCareScheduleModal from "./AddCareScheduleModal";
import AddVaccinationScheduleModal from "./AddVaccinationScheduleModal";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import EditScheduleModal from "./EditScheduleModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import Select from "../../activity/components/ClientOnlySelect";
import {
  defaultCareSchedules,
  defaultVaccinationSchedules,
  careSubTypeOptions,
  vaccinationSubTypeOptions,
} from "../../data/mockData";

export default function CareManagement({
  medications,
  onMedicationsUpdate,
  careSchedules,
  onCareSchedulesUpdate,
  vaccinationSchedules,
  onVaccinationSchedulesUpdate,
  onCalendarEventsChange,
  showDetailModal,
  setShowDetailModal,
  selectedSchedule,
  setSelectedSchedule,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "medication", "care", "vaccination"
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editingType, setEditingType] = useState(""); // "care" or "vaccination"

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive");
  const [showToast, setShowToast] = useState(false);

  // 필터링 상태
  const [careFilter, setCareFilter] = useState("전체");
  const [vaccinationFilter, setVaccinationFilter] = useState("전체");

  // 페이징 상태 - 돌봄 3개, 접종 2개로 수정
  const [carePage, setCarePage] = useState(1);
  const [vaccinationPage, setVaccinationPage] = useState(1);
  const careItemsPerPage = 3; // 돌봄 3개
  const vaccinationItemsPerPage = 2; // 접종 2개

  // react-select 공통 스타일 (활동관리 산책 드롭다운과 동일 톤)
  const selectStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#e6f4ea"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: state.isSelected ? "#4caf50" : "#374151",
      cursor: "pointer",
      ":active": {
        backgroundColor: "#c8e6c9",
        color: "#388e3c",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      minWidth: 160,
      borderColor: state.isFocused ? "#8bc34a" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(139,195,74,0.3)" : "none",
      "&:hover": {
        borderColor: "#8bc34a",
      },
      borderRadius: 8,
      paddingLeft: 2,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#adaebc",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 8,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      zIndex: 20,
    }),
  };

  // 드롭다운 옵션
  const careFilterOptions = [
    { value: "전체", label: "전체" },
    ...careSubTypeOptions.map((o) => ({ value: o, label: o })),
  ];
  const vaccinationFilterOptions = [
    { value: "전체", label: "전체" },
    ...vaccinationSubTypeOptions.map((o) => ({ value: o, label: o })),
  ];

  // 캘린더 이벤트를 상위 컴포넌트로 전달
  useEffect(() => {
    if (onCalendarEventsChange) {
      const events = buildCalendarEvents();
      onCalendarEventsChange(events);
    }
  }, [
    careSchedules,
    vaccinationSchedules,
    medications,
    onCalendarEventsChange,
  ]);

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
      onCareSchedulesUpdate((prev) => [...prev, newSchedule]);
    } else {
      onVaccinationSchedulesUpdate((prev) => [...prev, newSchedule]);
    }
    setToastMessage(`${newSchedule.name} 일정이 추가되었습니다.`);
    setToastType("active");
    setShowToast(true);
    setShowAddModal(false); // 모달 닫기

    // 캘린더 이벤트 즉시 업데이트
    const events = buildCalendarEvents();
    if (onCalendarEventsChange) {
      onCalendarEventsChange(events);
    }
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
      onCareSchedulesUpdate((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
      );
    } else {
      onVaccinationSchedulesUpdate((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
      );
    }

    setToastMessage(`${updatedSchedule.name} 일정이 수정되었습니다.`);
    setToastType("active");
    setShowToast(true);

    // 캘린더 이벤트 즉시 업데이트
    const events = buildCalendarEvents();
    if (onCalendarEventsChange) {
      onCalendarEventsChange(events);
    }
  };

  const toggleNotification = (id, type) => {
    if (type === "돌봄") {
      const updated = careSchedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isNotified: !schedule.isNotified }
          : schedule
      );
      onCareSchedulesUpdate(updated);
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
      onVaccinationSchedulesUpdate(updated);
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

  const requestDeleteMedication = (id) => {
    setToDeleteId(id);
    setDeleteType("투약");
    setShowConfirm(true);
  };

  const confirmDeleteSchedule = () => {
    if (toDeleteId == null) return;

    if (deleteType === "돌봄") {
      const updated = careSchedules.filter(
        (schedule) => schedule.id !== toDeleteId
      );
      onCareSchedulesUpdate(updated);

      // 토스트 메시지 표시
      const deletedSchedule = careSchedules.find(
        (schedule) => schedule.id === toDeleteId
      );
      if (deletedSchedule) {
        setToastMessage(`${deletedSchedule.name} 일정이 삭제되었습니다.`);
        setToastType("delete");
        setShowToast(true);
      }
    } else if (deleteType === "접종") {
      const updated = vaccinationSchedules.filter(
        (schedule) => schedule.id !== toDeleteId
      );
      onVaccinationSchedulesUpdate(updated);

      // 토스트 메시지 표시
      const deletedSchedule = vaccinationSchedules.find(
        (schedule) => schedule.id === toDeleteId
      );
      if (deletedSchedule) {
        setToastMessage(`${deletedSchedule.name} 일정이 삭제되었습니다.`);
        setToastType("delete");
        setShowToast(true);
      }
    } else if (deleteType === "투약") {
      const updated = medications.filter((med) => med.id !== toDeleteId);
      onMedicationsUpdate(updated);

      // 토스트 메시지 표시
      const deletedMed = medications.find((med) => med.id === toDeleteId);
      if (deletedMed) {
        setToastMessage(`${deletedMed.name} 투약이 삭제되었습니다.`);
        setToastType("delete");
        setShowToast(true);
      }
    }

    // 캘린더 이벤트 즉시 업데이트
    const events = buildCalendarEvents();
    if (onCalendarEventsChange) {
      onCalendarEventsChange(events);
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
    (carePage - 1) * careItemsPerPage,
    carePage * careItemsPerPage
  );
  const paginatedVaccinationSchedules = filteredVaccinationSchedules.slice(
    (vaccinationPage - 1) * vaccinationItemsPerPage,
    vaccinationPage * vaccinationItemsPerPage
  );

  // 페이징 핸들러
  const handleCarePageChange = (page) => {
    setCarePage(page);
  };

  const handleVaccinationPageChange = (page) => {
    setVaccinationPage(page);
  };

  // 캘린더 이벤트 구성 (투약 + 돌봄/접종)
  const buildCalendarEvents = () => {
    const parseDateTime = (d, t) => {
      const [y, m, day] = d.split("-").map(Number);
      const [hh = 9, mm = 0] = (t || "09:00").split(":").map(Number);
      return new Date(y, m - 1, day, hh, mm, 0);
    };

    // 투약 이벤트
    const medEvents = [];
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
            const s = parseDateTime(current.toISOString().slice(0, 10), hm);
            const e = new Date(s.getTime() + 60 * 60 * 1000);
            medEvents.push({
              id: `med-${med.id}-${current.toISOString().slice(0, 10)}-${hm}`,
              title: `${med.icon || "💊"} ${med.name}`,
              start: s,
              end: e,
              allDay: false,
              type: "medication",
              schedule: { ...med, category: "medication", type: "medication" },
            });
          });
          current.setDate(current.getDate() + 1);
        }
      }
    });

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

    return [...medEvents, ...careEvents, ...vacEvents];
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
      // selectedSchedule.schedule에서 원본 schedule의 id를 가져옴
      let scheduleId = selectedSchedule.id;

      // selectedSchedule.schedule이 있는 경우 (캘린더 이벤트에서 클릭한 경우)
      if (selectedSchedule.schedule && selectedSchedule.schedule.id) {
        scheduleId = selectedSchedule.schedule.id;
      }

      if (
        selectedSchedule.category === "care" ||
        selectedSchedule.type === "돌봄" ||
        (selectedSchedule.schedule &&
          selectedSchedule.schedule.category === "care")
      ) {
        // 돌봄 일정 삭제
        const updated = careSchedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
        onCareSchedulesUpdate(updated);
        setToastMessage(`${selectedSchedule.name} 일정이 삭제되었습니다.`);
      } else if (
        selectedSchedule.category === "vaccination" ||
        selectedSchedule.category === "checkup" ||
        selectedSchedule.type === "접종" ||
        (selectedSchedule.schedule &&
          (selectedSchedule.schedule.category === "vaccination" ||
            selectedSchedule.schedule.category === "checkup"))
      ) {
        // 접종 일정 삭제
        const updated = vaccinationSchedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
        onVaccinationSchedulesUpdate(updated);
        setToastMessage(`${selectedSchedule.name} 일정이 삭제되었습니다.`);
      } else if (selectedSchedule.category === "medication") {
        // 투약 일정 삭제
        const updated = medications.filter((med) => med.id !== scheduleId);
        onMedicationsUpdate(updated);
        setToastMessage(`${selectedSchedule.name} 투약이 삭제되었습니다.`);
      }
      setToastType("delete");
      setShowToast(true);

      // 캘린더 이벤트 즉시 업데이트
      const events = buildCalendarEvents();
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
      }
    }
    setShowDetailModal(false);
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
          ></button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 투약 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>투약</h3>
        </div>

        <div className={styles.scheduleList}>
          {medications.map((medication) => (
            <div key={medication.id} className={styles.scheduleCard}>
              <div className={styles.scheduleInfo}>
                <div
                  className={styles.scheduleIcon}
                  style={{ backgroundColor: medication.color }}
                >
                  {medication.icon}
                </div>
                <div className={styles.scheduleDetails}>
                  <h4>{medication.name}</h4>
                  <p>
                    {medication.type} • {medication.frequency}
                  </p>
                  <p className={styles.scheduleTime}>
                    {medication.scheduleTime}
                  </p>
                </div>
              </div>
              <div className={styles.scheduleActions}>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 돌봄 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>돌봄</h3>
          <div className={styles.headerControls}>
            <Select
              options={careFilterOptions}
              value={careFilterOptions.find((o) => o.value === careFilter)}
              onChange={(opt) => {
                setCareFilter(opt?.value || "전체");
                setCarePage(1);
              }}
              placeholder="유형 선택"
              classNamePrefix="react-select"
              styles={selectStyles}
            />
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

        {filteredCareSchedules.length > careItemsPerPage &&
          renderPagination(
            carePage,
            Math.ceil(filteredCareSchedules.length / careItemsPerPage),
            handleCarePageChange
          )}
      </div>

      {/* 접종 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>접종</h3>
          <div className={styles.headerControls}>
            <Select
              options={vaccinationFilterOptions}
              value={vaccinationFilterOptions.find(
                (o) => o.value === vaccinationFilter
              )}
              onChange={(opt) => {
                setVaccinationFilter(opt?.value || "전체");
                setVaccinationPage(1);
              }}
              placeholder="유형 선택"
              classNamePrefix="react-select"
              styles={selectStyles}
            />
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

        {filteredVaccinationSchedules.length > vaccinationItemsPerPage &&
          renderPagination(
            vaccinationPage,
            Math.ceil(
              filteredVaccinationSchedules.length / vaccinationItemsPerPage
            ),
            handleVaccinationPageChange
          )}
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
