"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/CareManagement.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import AddCareScheduleModal from "./AddCareScheduleModal";
import AddVaccinationScheduleModal from "./AddVaccinationScheduleModal";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";
import EditScheduleModal from "./EditScheduleModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import Select from "../../activity/components/ClientOnlySelect";
import ScheduleCard from "./common/ScheduleCard";
import MedicalFilter from "./common/MedicalFilter";
import EmptyState from "./common/EmptyState";
import {
  careSubTypeOptions,
  vaccinationSubTypeOptions,
  SUBTYPE_LABEL_MAP,
  ICON_MAP,
  careFilterOptions,
  vaccinationFilterOptions,
  PAGINATION_CONFIG,
  TIME_CONFIG,
  formatTime,
  formatDateToLocal,
  CARE_LABELS,
  VACCINATION_LABELS,
  CARE_MESSAGES,
  VACCINATION_MESSAGES,
  COMMON_MESSAGES,
  paginateArray,
  sortByLatest,
  filterByCondition,
  deepClone,
  isEmpty,
} from "../../constants";
import { careFrequencyMapping } from "../../constants/care";
import { vaccinationFrequencyMapping } from "../../constants/vaccination";
import { COLOR_MAP } from "../../constants/colors";
import {
  createCare,
  listCareSchedules,
  updateCareSchedule,
  deleteCareSchedule,
  toggleCareAlarm,
} from "../../../../api/medicationApi";

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
  const { selectedPetName, selectedPetNo } = useSelectedPet();
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
  const [calendarEvents, setCalendarEvents] = useState([]);

  // 필터링 상태 - 통합된 CARE 메인타입으로 변경
  const [careFilter, setCareFilter] = useState("전체");
  const [vaccinationFilter, setVaccinationFilter] = useState("전체");

  // 페이징 상태 - 돌봄 3개, 접종 2개로 수정
  const [carePage, setCarePage] = useState(1);
  const [vaccinationPage, setVaccinationPage] = useState(1);
  const careItemsPerPage = PAGINATION_CONFIG.CARE.itemsPerPage; // 돌봄 3개
  const vaccinationItemsPerPage = PAGINATION_CONFIG.VACCINATION.itemsPerPage; // 접종 2개

  // 서브타입 기반 분류 함수들
  const isCareSubType = (subType) => {
    return ["WALK", "BIRTHDAY", "GROOMING", "ETC"].includes(subType);
  };

  const isVaccinationSubType = (subType) => {
    return ["VACCINE", "CHECKUP"].includes(subType);
  };

  const getScheduleIcon = (subType) => {
    return ICON_MAP[subType] || "📅";
  };

  const getScheduleLabel = (subType) => {
    return SUBTYPE_LABEL_MAP[subType] || subType;
  };

  // 시간 형식 변환은 constants에서 import

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

  // 드롭다운 옵션은 constants에서 import

  // 캘린더 이벤트 구성 (투약 + 돌봄/접종) - useEffect 이전에 선언
  const buildCalendarEvents = useCallback(() => {
    console.log("🔍 buildCalendarEvents 함수 호출됨");
    console.log("🔍 현재 돌봄 일정 데이터:", careSchedules);
    console.log("🔍 현재 접종 일정 데이터:", vaccinationSchedules);

    const parseDateTime = (d, t) => {
      const [y, m, day] = d.split("-").map(Number);
      const [hh = 9, mm = 0] = (t || "09:00").split(":").map(Number);
      return new Date(y, m - 1, day, hh, mm, 0, 0); // 초와 밀리초는 0으로 설정
    };

    // 날짜를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수 (로컬 시간대 사용)
    const formatDateToLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // 투약 이벤트 - 선택된 펫의 투약만 필터링
    const medEvents = [];
    medications
      .filter((med) => !selectedPetName || med.petName === selectedPetName)
      .forEach((med) => {
        if (med.startDate && med.endDate) {
          const start = new Date(med.startDate);
          const end = new Date(med.endDate);
          const times = (med.scheduleTime || "09:00").split(",").map((t) => {
            // 시간 문자열에서 초 제거 (예: "09:00:00" -> "09:00")
            const trimmed = t.trim();
            if (trimmed.includes(":")) {
              const parts = trimmed.split(":");
              if (parts.length >= 2) {
                return `${parts[0]}:${parts[1]}`;
              }
            }
            return trimmed;
          });
          const current = new Date(start);
          while (current <= end) {
            times.forEach((hm) => {
              const s = parseDateTime(formatDateToLocal(current), hm);
              const e = new Date(s.getTime() + 60 * 60 * 1000); // 1시간 후
              medEvents.push({
                id: `med-${med.id}-${formatDateToLocal(current)}-${hm}`,
                title: `${med.icon || "💊"} ${med.name}`,
                start: s,
                end: e,
                allDay: false,
                // 캘린더 필터와 색상 매핑을 위해 투약 유형(복용약/영양제)로 설정
                type: med.type || "복용약",
                schedule: {
                  ...med,
                  category: "medication",
                  type: med.type || "복용약",
                },
              });
            });
            current.setDate(current.getDate() + 1);
          }
        }
      });

    const careEvents = [];
    console.log("🔍 돌봄 일정 처리 시작");
    careSchedules
      .filter((s) => !selectedPetName || s.petName === selectedPetName)
      .forEach((s) => {
        console.log("🔍 돌봄 일정 처리 중:", s);
        if (s.startDate && s.endDate) {
          // 새로운 형식: startDate와 endDate 사용
          const start = new Date(s.startDate);
          const end = new Date(s.endDate);
          const frequency = s.frequency || s.careFrequency;

          console.log("🔍 돌봄 일정 빈도 처리:", {
            frequency: frequency,
            startDate: s.startDate,
            endDate: s.endDate,
          });

          // 시간 파싱 - times 배열 또는 scheduleTime 문자열에서 첫 번째 시간 추출
          const getFirstTime = () => {
            if (s.times && s.times.length > 0) {
              // 백엔드에서 온 times 배열 사용
              return s.times[0];
            } else if (s.scheduleTime) {
              // scheduleTime 문자열에서 첫 번째 시간 추출
              const times = s.scheduleTime.split(",").map((t) => t.trim());
              return times[0] || "09:00";
            }
            return "09:00";
          };

          // 빈도에 따른 일정 생성
          if (frequency === "당일") {
            // 당일: 시작일 하루만
            const firstTime = getFirstTime();
            const sTime = parseDateTime(formatDateToLocal(start), firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            careEvents.push({
              id: `care-${s.id}-${formatDateToLocal(start)}`,
              title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: getScheduleLabel(s.subType) || "산책",
              schedule: {
                ...s,
                category: "care",
                type: "돌봄",
                icon: getScheduleIcon(s.subType),
                color: COLOR_MAP[s.subType] || "#E8F5E8",
              },
            });
            console.log(
              `🔍 당일 일정 생성: ${s.title || s.name} - ${formatDateToLocal(
                start
              )}`
            );
          } else if (frequency === "매일") {
            // 매일: 시작일부터 종료일까지 모든 날
            const current = new Date(start);
            let dayCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              careEvents.push({
                id: `care-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "산책",
                schedule: {
                  ...s,
                  category: "care",
                  type: "돌봄",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#E8F5E8",
                },
              });
              dayCount++;
              console.log(
                `🔍 매일 일정 생성 [${dayCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setDate(current.getDate() + 1);
            }
            console.log(`🔍 매일 일정 총 생성 개수: ${dayCount}개`);
          } else if (frequency === "매주") {
            // 매주: 7일마다
            const current = new Date(start);
            let weekCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              careEvents.push({
                id: `care-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "산책",
                schedule: {
                  ...s,
                  category: "care",
                  type: "돌봄",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#E8F5E8",
                },
              });
              weekCount++;
              console.log(
                `🔍 매주 일정 생성 [${weekCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setDate(current.getDate() + 7);
            }
            console.log(`🔍 매주 일정 총 생성 개수: ${weekCount}개`);
          } else if (frequency === "매월") {
            // 매월: 매월 같은 날짜
            const current = new Date(start);
            let monthCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              careEvents.push({
                id: `care-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "산책",
                schedule: {
                  ...s,
                  category: "care",
                  type: "돌봄",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#E8F5E8",
                },
              });
              monthCount++;
              console.log(
                `🔍 매월 일정 생성 [${monthCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setMonth(current.getMonth() + 1);
            }
            console.log(`🔍 매월 일정 총 생성 개수: ${monthCount}개`);
          }
        } else if (s.date) {
          // 기존 형식: date 사용 (호환성 유지)
          const sTime = parseDateTime(s.date, s.scheduleTime || "09:00");
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          careEvents.push({
            id: `care-${s.id}`,
            title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
            start: sTime,
            end: eTime,
            allDay: false,
            type: getScheduleLabel(s.subType) || "산책",
            schedule: {
              ...s,
              category: "care",
              type: "돌봄",
              icon: getScheduleIcon(s.subType),
              color: COLOR_MAP[s.subType] || "#E8F5E8",
            },
          });
        }
      });

    const vacEvents = [];
    vaccinationSchedules
      .filter((s) => !selectedPetName || s.petName === selectedPetName)
      .forEach((s) => {
        if (s.startDate && s.endDate) {
          // 새로운 형식: startDate와 endDate 사용
          const start = new Date(s.startDate);
          const end = new Date(s.endDate);
          const frequency = s.frequency || s.careFrequency;
          // 백엔드에서 이미 한글 label 값으로 오므로 변환 불필요

          // 시간 파싱 - times 배열 또는 scheduleTime 문자열에서 첫 번째 시간 추출
          const getFirstTime = () => {
            if (s.times && s.times.length > 0) {
              // 백엔드에서 온 times 배열 사용
              return s.times[0];
            } else if (s.scheduleTime) {
              // scheduleTime 문자열에서 첫 번째 시간 추출
              const times = s.scheduleTime.split(",").map((t) => t.trim());
              return times[0] || "10:00";
            }
            return "10:00";
          };

          // 빈도에 따른 일정 생성
          if (frequency === "당일") {
            // 당일: 시작일 하루만
            const firstTime = getFirstTime();
            const sTime = parseDateTime(formatDateToLocal(start), firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            vacEvents.push({
              id: `vac-${s.id}-${formatDateToLocal(start)}`,
              title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: getScheduleLabel(s.subType) || "예방접종",
              schedule: {
                ...s,
                category: "vaccination",
                type: "접종",
                icon: getScheduleIcon(s.subType),
                color: COLOR_MAP[s.subType] || "#F3E5F5",
              },
            });
            console.log(
              `🔍 접종 당일 일정 생성: ${
                s.title || s.name
              } - ${formatDateToLocal(start)}`
            );
          } else if (frequency === "매일") {
            // 매일: 시작일부터 종료일까지 모든 날
            const current = new Date(start);
            let dayCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              vacEvents.push({
                id: `vac-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "예방접종",
                schedule: {
                  ...s,
                  category: "vaccination",
                  type: "접종",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#F3E5F5",
                },
              });
              dayCount++;
              console.log(
                `🔍 접종 매일 일정 생성 [${dayCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setDate(current.getDate() + 1);
            }
            console.log(`🔍 접종 매일 일정 총 생성 개수: ${dayCount}개`);
          } else if (frequency === "매주") {
            // 매주: 7일마다
            const current = new Date(start);
            let weekCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              vacEvents.push({
                id: `vac-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "예방접종",
                schedule: {
                  ...s,
                  category: "vaccination",
                  type: "접종",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#F3E5F5",
                },
              });
              weekCount++;
              console.log(
                `🔍 접종 매주 일정 생성 [${weekCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setDate(current.getDate() + 7);
            }
            console.log(`🔍 접종 매주 일정 총 생성 개수: ${weekCount}개`);
          } else if (frequency === "매월") {
            // 매월: 매월 같은 날짜
            const current = new Date(start);
            let monthCount = 0;
            while (current <= end) {
              const firstTime = getFirstTime();
              const sTime = parseDateTime(
                formatDateToLocal(current),
                firstTime
              );
              const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
              vacEvents.push({
                id: `vac-${s.id}-${formatDateToLocal(current)}`,
                title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
                start: sTime,
                end: eTime,
                allDay: false,
                type: getScheduleLabel(s.subType) || "예방접종",
                schedule: {
                  ...s,
                  category: "vaccination",
                  type: "접종",
                  icon: getScheduleIcon(s.subType),
                  color: COLOR_MAP[s.subType] || "#F3E5F5",
                },
              });
              monthCount++;
              console.log(
                `🔍 접종 매월 일정 생성 [${monthCount}]: ${
                  s.title || s.name
                } - ${formatDateToLocal(current)}`
              );
              current.setMonth(current.getMonth() + 1);
            }
            console.log(`🔍 접종 매월 일정 총 생성 개수: ${monthCount}개`);
          }
        } else {
          // 기존 형식: date 사용 (호환성 유지)
          const dateStr = s.date || new Date().toISOString().slice(0, 10);
          const sTime = parseDateTime(dateStr, s.scheduleTime || "10:00");
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          vacEvents.push({
            id: `vac-${s.id}`,
            title: `${getScheduleIcon(s.subType)} ${s.title || s.name}`,
            start: sTime,
            end: eTime,
            allDay: false,
            type: getScheduleLabel(s.subType) || "예방접종",
            schedule: {
              ...s,
              category: "vaccination",
              type: "접종",
              icon: getScheduleIcon(s.subType),
              color: COLOR_MAP[s.subType] || "#F3E5F5",
            },
          });
        }
      });

    const allEvents = [...medEvents, ...careEvents, ...vacEvents];
    console.log("🔍 최종 캘린더 이벤트 결과:", {
      medEvents: medEvents.length,
      careEvents: careEvents.length,
      vacEvents: vacEvents.length,
      total: allEvents.length,
      careEventsDetail: careEvents,
      vacEventsDetail: vacEvents,
    });
    return allEvents;
  }, [medications, careSchedules, vaccinationSchedules, selectedPetName]);

  // 캘린더 이벤트를 상위 컴포넌트로 전달
  useEffect(() => {
    console.log("🔍 CareManagement - 캘린더 이벤트 업데이트 시작");
    console.log("🔍 현재 돌봄 일정:", careSchedules);
    console.log("🔍 현재 접종 일정:", vaccinationSchedules);

    const events = buildCalendarEvents();
    console.log("🔍 CareManagement - 생성된 캘린더 이벤트:", events);
    console.log("🔍 CareManagement - 이벤트 개수:", events.length);

    // 로컬 상태 업데이트
    setCalendarEvents(events);

    // 상위 컴포넌트로 전달
    if (onCalendarEventsChange) {
      onCalendarEventsChange(events);
      console.log("🔍 CareManagement - 상위 컴포넌트로 이벤트 전달 완료");
    }
  }, [
    careSchedules,
    vaccinationSchedules,
    medications,
    selectedPetName,
    onCalendarEventsChange,
    buildCalendarEvents,
  ]);

  // 돌봄 일정 추가 버튼 클릭
  const handleAddCareSchedule = () => {
    setShowAddModal("care");
  };

  // 접종 일정 추가 버튼 클릭
  const handleAddVaccinationSchedule = () => {
    setShowAddModal("vaccination");
  };

  const handleAddNewSchedule = async (newSchedule) => {
    try {
      if (!selectedPetNo) {
        throw new Error("반려동물을 선택해주세요.");
      }

      let calNo;

      // 백엔드 CareRequestDTO에 맞춘 데이터 구조
      const careData = {
        petNo: selectedPetNo,
        title: newSchedule.name, // 백엔드에서는 title 필드 사용
        subType: newSchedule.subType, // 서브타입으로 구분 (WALK/BIRTHDAY/GROOMING/ETC/VACCINE/CHECKUP)
        careFrequency: isVaccinationSubType(newSchedule.subType)
          ? vaccinationFrequencyMapping[newSchedule.frequency]
          : careFrequencyMapping[newSchedule.frequency], // 한글 → 영어 enum 변환
        startDate: newSchedule.startDate,
        endDate: newSchedule.endDate,
        times: newSchedule.scheduleTime
          ? newSchedule.scheduleTime
              .split(", ")
              .map((time) => time.trim() + ":00") // "09:00" → "09:00:00" (LocalTime 형식)
          : ["09:00:00"], // 기본값도 LocalTime 형식으로
        reminderDaysBefore: parseInt(newSchedule.notificationTiming, 10) || 0,
      };

      // 디버깅: 전송할 데이터 확인
      console.log("🔍 돌봄 일정 생성 요청 데이터:", careData);
      console.log("🔍 빈도 매핑 확인:", {
        original: newSchedule.frequency,
        mapped: isVaccinationSubType(newSchedule.subType)
          ? vaccinationFrequencyMapping[newSchedule.frequency]
          : careFrequencyMapping[newSchedule.frequency],
      });

      calNo = await createCare(careData);
      console.log("🔍 API 응답 (calNo):", calNo);

      // 성공 시 로컬 상태 업데이트 (서브타입에 따라 분류)
      const updatedSchedule = {
        ...newSchedule,
        id: calNo,
        reminderDaysBefore: parseInt(newSchedule.notificationTiming, 10) || 0,
        lastReminderDaysBefore:
          parseInt(newSchedule.notificationTiming, 10) || 0,
        isNotified: true,
      };

      // 즉시 로컬 상태 업데이트 (빠른 UI 반응)
      if (isVaccinationSubType(newSchedule.subType)) {
        onVaccinationSchedulesUpdate((prev) => {
          console.log("🔍 접종 일정 추가 전:", prev.length);
          const updated = [...prev, updatedSchedule];
          console.log("🔍 접종 일정 추가 후:", updated.length);
          console.log("🔍 추가된 접종 일정:", updatedSchedule);
          return updated;
        });
        // 접종 일정 추가 후 페이지를 1로 리셋
        setVaccinationPage(1);
      } else if (isCareSubType(newSchedule.subType)) {
        onCareSchedulesUpdate((prev) => {
          console.log("🔍 돌봄 일정 추가 전:", prev.length);
          const updated = [...prev, updatedSchedule];
          console.log("🔍 돌봄 일정 추가 후:", updated.length);
          console.log("🔍 추가된 돌봄 일정:", updatedSchedule);
          return updated;
        });
        // 돌봄 일정 추가 후 페이지를 1로 리셋
        setCarePage(1);
      }

      // 생성된 일정 개수 계산
      const startDate = new Date(newSchedule.startDate);
      const endDate = new Date(newSchedule.endDate);
      let scheduleCount = 1; // 기본값

      if (newSchedule.frequency === "매일") {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        scheduleCount = daysDiff;
      } else if (newSchedule.frequency === "매주") {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const weeksDiff = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7)) + 1;
        scheduleCount = weeksDiff;
      } else if (newSchedule.frequency === "매월") {
        const yearDiff = endDate.getFullYear() - startDate.getFullYear();
        const monthDiff = endDate.getMonth() - startDate.getMonth();
        scheduleCount = yearDiff * 12 + monthDiff + 1;
      }

      setToastMessage(
        `${scheduleCount}개의 ${newSchedule.name} 일정이 추가되었습니다.`
      );
      setToastType("active");
      setShowToast(true);
      setShowAddModal(false); // 모달 닫기

      // 캘린더 이벤트 즉시 업데이트
      console.log("🔍 일정 추가 후 캘린더 이벤트 생성 시작");
      const events = buildCalendarEvents();
      console.log("🔍 생성된 캘린더 이벤트 개수:", events.length);
      console.log("🔍 생성된 캘린더 이벤트:", events);
      setCalendarEvents(events);
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
        console.log("🔍 상위 컴포넌트로 캘린더 이벤트 전달 완료");
      }

      // 백그라운드에서 데이터 동기화 (1초 후)
      setTimeout(() => {
        // 돌봄/접종 일정은 별도의 fetch 함수가 없으므로
        // 상위 컴포넌트에서 데이터를 다시 가져오도록 알림
        const updatedEvents = buildCalendarEvents();
        setCalendarEvents(updatedEvents);
        if (onCalendarEventsChange) {
          onCalendarEventsChange(updatedEvents);
        }
      }, 1000);
    } catch (error) {
      console.error("일정 생성 실패:", error);
      let errorMessage = "일정 생성에 실패했습니다.";

      if (error.message === "반려동물을 선택해주세요.") {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = "입력 정보를 확인해주세요.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다.";
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
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

  const handleEditScheduleSubmit = async (updatedSchedule) => {
    try {
      if (!selectedPetNo) {
        throw new Error("반려동물을 선택해주세요.");
      }

      // 백엔드 CareRequestDTO에 맞춘 데이터 구조
      let endDate = updatedSchedule.endDate;

      // 매일 일정의 경우 시작일과 종료일이 같으면 다음날로 설정 (백엔드 검증 우회)
      if (
        updatedSchedule.frequency === "매일" &&
        updatedSchedule.startDate === updatedSchedule.endDate
      ) {
        const startDate = new Date(updatedSchedule.startDate);
        startDate.setDate(startDate.getDate() + 1);
        endDate = startDate.toISOString().split("T")[0];
        console.log("🔧 매일 일정 종료일 자동 조정:", {
          original: updatedSchedule.endDate,
          adjusted: endDate,
        });
      }

      const updateData = {
        title: updatedSchedule.name,
        subType: updatedSchedule.subType, // 서브타입으로 구분
        careFrequency: isVaccinationSubType(updatedSchedule.subType)
          ? vaccinationFrequencyMapping[updatedSchedule.frequency]
          : careFrequencyMapping[updatedSchedule.frequency], // 한글 → 영어 enum 변환
        startDate: updatedSchedule.startDate,
        endDate: endDate,
        times: updatedSchedule.scheduleTime
          ? updatedSchedule.scheduleTime
              .split(", ")
              .map((time) => time.trim() + ":00") // "09:00" → "09:00:00" (LocalTime 형식)
          : ["09:00:00"], // 기본값도 LocalTime 형식으로
        reminderDaysBefore:
          parseInt(updatedSchedule.reminderDaysBefore, 10) || 0,
      };

      console.log("🔧 돌봄/접종 일정 수정 요청 데이터:", {
        id: updatedSchedule.id,
        updateData,
        originalSchedule: updatedSchedule,
      });

      // API 호출
      const result = await updateCareSchedule(updatedSchedule.id, updateData);

      console.log("✅ 돌봄/접종 일정 수정 API 응답:", result);

      // 즉시 로컬 상태 업데이트 (빠른 UI 반응)
      if (isVaccinationSubType(updatedSchedule.subType)) {
        onVaccinationSchedulesUpdate((prev) =>
          prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
        );
        // 접종 일정 수정 후 페이지를 1로 리셋
        setVaccinationPage(1);
      } else if (isCareSubType(updatedSchedule.subType)) {
        onCareSchedulesUpdate((prev) =>
          prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
        );
        // 돌봄 일정 수정 후 페이지를 1로 리셋
        setCarePage(1);
      }

      setToastMessage(`${updatedSchedule.name} 일정이 수정되었습니다.`);
      setToastType("active");
      setShowToast(true);

      // 캘린더 이벤트 즉시 업데이트
      const events = buildCalendarEvents();
      setCalendarEvents(events);
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
      }

      // 백그라운드에서 데이터 동기화 (1초 후)
      setTimeout(() => {
        const updatedEvents = buildCalendarEvents();
        setCalendarEvents(updatedEvents);
        if (onCalendarEventsChange) {
          onCalendarEventsChange(updatedEvents);
        }
      }, 1000);
    } catch (error) {
      console.error("❌ 돌봄/접종 일정 수정 실패:", error);
      console.error("❌ 에러 상세 정보:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      let errorMessage = "일정 수정에 실패했습니다.";
      if (error.message === "반려동물을 선택해주세요.") {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = "입력 정보를 확인해주세요.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    }
  };

  const toggleNotification = async (id, type) => {
    try {
      // API 호출
      const result = await toggleCareAlarm(id);

      // 성공 시 로컬 상태 업데이트 - 서브타입 기반으로 분류
      const careSchedule = careSchedules.find((schedule) => schedule.id === id);
      const vaccinationSchedule = vaccinationSchedules.find(
        (schedule) => schedule.id === id
      );

      if (careSchedule) {
        const updated = careSchedules.map((schedule) =>
          schedule.id === id ? { ...schedule, isNotified: result } : schedule
        );
        onCareSchedulesUpdate(updated);
        const updatedSchedule = updated.find((schedule) => schedule.id === id);
        setToastMessage(
          `${updatedSchedule.name} 알림이 ${
            updatedSchedule.isNotified ? "활성화" : "비활성화"
          } 되었습니다.`
        );
        setToastType(updatedSchedule.isNotified ? "active" : "inactive");
      } else if (vaccinationSchedule) {
        const updated = vaccinationSchedules.map((schedule) =>
          schedule.id === id ? { ...schedule, isNotified: result } : schedule
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
    } catch (error) {
      console.error("알림 토글 실패:", error);
      let errorMessage = "알림 설정 변경에 실패했습니다.";

      if (error.response?.status === 400) {
        errorMessage = "알림 설정을 변경할 수 없습니다.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다.";
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    }
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

  const confirmDeleteSchedule = async () => {
    if (toDeleteId == null) return;

    try {
      if (deleteType === "돌봄" || deleteType === "접종") {
        // 돌봄/접종 일정 삭제 API 호출
        await deleteCareSchedule(toDeleteId);

        // 성공 시 로컬 상태 업데이트 - 서브타입 기반으로 분류
        const careSchedule = careSchedules.find(
          (schedule) => schedule.id === toDeleteId
        );
        const vaccinationSchedule = vaccinationSchedules.find(
          (schedule) => schedule.id === toDeleteId
        );

        if (careSchedule) {
          const updated = careSchedules.filter(
            (schedule) => schedule.id !== toDeleteId
          );
          onCareSchedulesUpdate(updated);
          // 돌봄 일정 삭제 후 페이지를 1로 리셋
          setCarePage(1);

          // 토스트 메시지 표시
          setToastMessage(`${careSchedule.name} 일정이 삭제되었습니다.`);
          setToastType("delete");
          setShowToast(true);
        } else if (vaccinationSchedule) {
          const updated = vaccinationSchedules.filter(
            (schedule) => schedule.id !== toDeleteId
          );
          onVaccinationSchedulesUpdate(updated);
          // 접종 일정 삭제 후 페이지를 1로 리셋
          setVaccinationPage(1);

          // 토스트 메시지 표시
          setToastMessage(`${vaccinationSchedule.name} 일정이 삭제되었습니다.`);
          setToastType("delete");
          setShowToast(true);
        }
      } else if (deleteType === "투약") {
        // 투약은 MedicationManagement에서 처리하므로 여기서는 로컬 상태만 업데이트
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
      setCalendarEvents(events);
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
      }

      setShowConfirm(false);
      setToDeleteId(null);
      setDeleteType("");
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      let errorMessage = "일정 삭제에 실패했습니다.";

      if (error.response?.status === 400) {
        errorMessage = "삭제할 수 없는 일정입니다.";
      } else if (error.response?.status === 500) {
        errorMessage = "서버 오류가 발생했습니다.";
      }

      setToastMessage(errorMessage);
      setToastType("error");
      setShowToast(true);
    }
  };

  const cancelDeleteSchedule = () => {
    setShowConfirm(false);
    setToDeleteId(null);
    setDeleteType("");
  };

  // 일정을 빈도별로 확장하여 표시하는 함수
  const expandSchedulesByFrequency = (schedules) => {
    const expandedSchedules = [];

    schedules.forEach((schedule) => {
      if (schedule.startDate && schedule.endDate) {
        const start = new Date(schedule.startDate);
        const end = new Date(schedule.endDate);
        const frequency = schedule.frequency || schedule.careFrequency;

        if (frequency === "당일") {
          // 당일: 1개만 추가
          expandedSchedules.push({
            ...schedule,
            displayDate: schedule.startDate,
            displayKey: `${schedule.id}-${schedule.startDate}`,
          });
        } else if (frequency === "매일") {
          // 매일: 각 날짜별로 추가
          const current = new Date(start);
          while (current <= end) {
            expandedSchedules.push({
              ...schedule,
              displayDate: formatDateToLocal(current),
              displayKey: `${schedule.id}-${formatDateToLocal(current)}`,
            });
            current.setDate(current.getDate() + 1);
          }
        } else if (frequency === "매주") {
          // 매주: 각 주별로 추가
          const current = new Date(start);
          while (current <= end) {
            expandedSchedules.push({
              ...schedule,
              displayDate: formatDateToLocal(current),
              displayKey: `${schedule.id}-${formatDateToLocal(current)}`,
            });
            current.setDate(current.getDate() + 7);
          }
        } else if (frequency === "매월") {
          // 매월: 각 월별로 추가
          const current = new Date(start);
          while (current <= end) {
            expandedSchedules.push({
              ...schedule,
              displayDate: formatDateToLocal(current),
              displayKey: `${schedule.id}-${formatDateToLocal(current)}`,
            });
            current.setMonth(current.getMonth() + 1);
          }
        }
      } else {
        // 기존 형식: date 사용
        expandedSchedules.push({
          ...schedule,
          displayDate: schedule.date || new Date().toISOString().slice(0, 10),
          displayKey: schedule.id,
        });
      }
    });

    // 확장된 일정들을 정렬: 먼저 등록 순서(ID), 그 다음 날짜 순서
    return expandedSchedules.sort((a, b) => {
      // 1. 등록 순서 (ID) - 최신 등록된 일정이 위에
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      if (idA !== idB) {
        return idB - idA; // 내림차순 (최신이 위로)
      }

      // 2. 같은 일정 내에서는 날짜 순서 - 최신 날짜가 위에
      const dateA = new Date(a.displayDate);
      const dateB = new Date(b.displayDate);
      return dateB - dateA; // 내림차순 (최신 날짜가 위로)
    });
  };

  // 날짜 형식 변환은 constants에서 import

  // 필터링된 원본 일정들 (최신순 정렬 포함)
  const filteredOriginalCareSchedules = careSchedules
    .filter(
      (schedule) =>
        (careFilter === "전체" || schedule.subType === careFilter) &&
        (!selectedPetName || schedule.petName === selectedPetName)
    )
    .sort((a, b) => {
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA; // 내림차순 (최신이 위로)
    });

  const filteredOriginalVaccinationSchedules = vaccinationSchedules
    .filter(
      (schedule) =>
        (vaccinationFilter === "전체" ||
          schedule.subType === vaccinationFilter) &&
        (!selectedPetName || schedule.petName === selectedPetName)
    )
    .sort((a, b) => {
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA; // 내림차순 (최신이 위로)
    });

  // 모든 원본 일정을 확장한 후 페이징
  const allExpandedCareSchedules = expandSchedulesByFrequency(
    filteredOriginalCareSchedules
  );
  const allExpandedVaccinationSchedules = expandSchedulesByFrequency(
    filteredOriginalVaccinationSchedules
  );

  // 확장된 일정 기준으로 페이징
  const paginatedCareSchedules = paginateArray(
    allExpandedCareSchedules,
    carePage,
    careItemsPerPage
  );
  const paginatedVaccinationSchedules = paginateArray(
    allExpandedVaccinationSchedules,
    vaccinationPage,
    vaccinationItemsPerPage
  );

  // 페이징 핸들러
  const handleCarePageChange = (page) => {
    setCarePage(page);
  };

  const handleVaccinationPageChange = (page) => {
    setVaccinationPage(page);
  };

  // 일정 상세 모달 핸들러
  const handleDetailModalEdit = () => {
    if (selectedSchedule) {
      setEditingSchedule(selectedSchedule);
      // schedule 객체에서 category 또는 type을 확인하여 올바른 편집 타입 설정
      const scheduleCategory =
        selectedSchedule.category || selectedSchedule.type;
      if (scheduleCategory === "care" || scheduleCategory === "돌봄") {
        setEditingType("care");
      } else if (
        scheduleCategory === "vaccination" ||
        scheduleCategory === "접종"
      ) {
        setEditingType("vaccination");
      } else {
        // 기본값으로 돌봄 설정
        setEditingType("care");
      }
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

      // 서브타입 기반으로 분류하여 삭제
      const careSchedule = careSchedules.find(
        (schedule) => schedule.id === scheduleId
      );
      const vaccinationSchedule = vaccinationSchedules.find(
        (schedule) => schedule.id === scheduleId
      );

      if (careSchedule) {
        // 돌봄 일정 삭제
        const updated = careSchedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
        onCareSchedulesUpdate(updated);
        // 돌봄 일정 삭제 후 페이지를 1로 리셋
        setCarePage(1);
        setToastMessage(`${selectedSchedule.name} 일정이 삭제되었습니다.`);
      } else if (vaccinationSchedule) {
        // 접종 일정 삭제
        const updated = vaccinationSchedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
        onVaccinationSchedulesUpdate(updated);
        // 접종 일정 삭제 후 페이지를 1로 리셋
        setVaccinationPage(1);
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
      setCalendarEvents(events);
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
      }
    }
    setShowDetailModal(false);
  };

  // renderScheduleCard는 ScheduleCard 컴포넌트로 대체됨

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
      {/* 돌봄 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>돌봄</h3>
          <div className={styles.headerControls}>
            <MedicalFilter
              type="care"
              options={careFilterOptions}
              value={careFilter}
              onChange={(value) => {
                setCareFilter(value || "전체");
                setCarePage(1);
              }}
              styles={selectStyles}
            />
            <button
              className={styles.addButton}
              onClick={handleAddCareSchedule}
            >
              <span>추가</span>
              <img
                src="/health/pets.png"
                alt="돌봄 추가 아이콘"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

        <div className={styles.scheduleList}>
          {paginatedCareSchedules.length === 0 ? (
            <EmptyState type="care" className={styles.emptyContainer} />
          ) : (
            paginatedCareSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.displayKey || schedule.id}
                schedule={schedule}
                type="돌봄"
                onEdit={handleEditSchedule}
                onDelete={requestDeleteSchedule}
                onToggleNotification={toggleNotification}
              />
            ))
          )}
        </div>

        {allExpandedCareSchedules.length > careItemsPerPage && (
          <div className={styles.pagination}>
            {renderPagination(
              carePage,
              Math.ceil(allExpandedCareSchedules.length / careItemsPerPage),
              handleCarePageChange
            )}
          </div>
        )}
      </div>

      {/* 예방접종 일정 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>접종</h3>
          <div className={styles.headerControls}>
            <MedicalFilter
              type="vaccination"
              options={vaccinationFilterOptions}
              value={vaccinationFilter}
              onChange={(value) => {
                setVaccinationFilter(value || "전체");
                setVaccinationPage(1);
              }}
              styles={selectStyles}
            />
            <button
              className={styles.addButton}
              onClick={handleAddVaccinationSchedule}
            >
              <span>추가</span>
              <img
                src="/health/syringe.png"
                alt="예방접종 추가 아이콘"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

        <div className={styles.scheduleList}>
          {paginatedVaccinationSchedules.length === 0 ? (
            <EmptyState type="vaccination" className={styles.emptyContainer} />
          ) : (
            paginatedVaccinationSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.displayKey || schedule.id}
                schedule={schedule}
                type="접종"
                onEdit={handleEditSchedule}
                onDelete={requestDeleteSchedule}
                onToggleNotification={toggleNotification}
              />
            ))
          )}
        </div>

        {allExpandedVaccinationSchedules.length > vaccinationItemsPerPage && (
          <div className={styles.pagination}>
            {renderPagination(
              vaccinationPage,
              Math.ceil(
                allExpandedVaccinationSchedules.length / vaccinationItemsPerPage
              ),
              handleVaccinationPageChange
            )}
          </div>
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
