"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/MedicationManagement.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import { useMedicalData } from "../../hooks/useMedicalData";
import { useMedicalModal } from "../../hooks/useMedicalModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import AddMedicationModal from "./AddMedicationModal";
import EditScheduleModal from "./EditScheduleModal";
import PrescriptionResultModal from "./PrescriptionResultModal";
import PrescriptionErrorModal from "./PrescriptionErrorModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import Select from "../../activity/components/ClientOnlySelect";
import MedicationCard from "./common/MedicationCard";
import MedicalFilter from "./common/MedicalFilter";
import EmptyState from "./common/EmptyState";
import LoadingSpinner from "./common/LoadingSpinner";
import { listCareSchedules } from "../../../../api/medicationApi";
import { useMedication } from "../../hooks/useMedication";
import {
  STORAGE_KEYS,
  frequencyMapping,
  medicationFilterOptions,
  PAGINATION_CONFIG,
  TIME_CONFIG,
  FILE_UPLOAD_CONFIG,
  getDefaultTimes,
  getMedicationIcon,
  formatTime,
  formatDateToLocal,
  MEDICATION_LABELS,
  MEDICATION_MESSAGES,
  COMMON_MESSAGES,
  VALIDATION_MESSAGES,
  paginateArray,
  sortByLatest,
  filterByCondition,
  deepClone,
  isEmpty,
} from "../../constants";
import { careFrequencyMapping } from "../../constants/care";
import { vaccinationFrequencyMapping } from "../../constants/vaccination";
import { COLOR_MAP } from "../../constants/colors";

export default function MedicationManagement({
  careSchedules,
  onCareSchedulesUpdate,
  vaccinationSchedules,
  onVaccinationSchedulesUpdate,
  onCalendarEventsChange,
  showDetailModal,
  setShowDetailModal,
  selectedSchedule,
  setSelectedSchedule,
  onRefreshCareSchedules,
}) {
  const { selectedPetName, selectedPetNo } = useSelectedPet();
  const medicalData = useMedicalData();
  const modal = useMedicalModal();
  const LOCAL_STORAGE_KEY = STORAGE_KEYS.MEDICATION_NOTIFICATIONS;

  // useMedication 훅 사용
  const {
    medications,
    isLoading,
    error,
    fetchMedications,
    addMedication,
    updateMedication: updateMedicationData,
    deleteMedication: removeMedication,
    toggleNotification,
    processPrescription,
  } = useMedication();

  // 상태 변수들
  const [medicationFilter, setMedicationFilter] = useState("전체");
  const [medicationPage, setMedicationPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrescriptionResultModal, setShowPrescriptionResultModal] =
    useState(false);
  const [showPrescriptionErrorModal, setShowPrescriptionErrorModal] =
    useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [prescriptionResult, setPrescriptionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // 투약 일정 필터 옵션은 constants에서 import

  // 빈도 매핑은 useMedication 훅에서 처리

  // 타입 매핑 (한글 → Enum)
  const typeToEnum = {
    복용약: "PILL",
    영양제: "SUPPLEMENT",
  };

  const itemsPerPage = PAGINATION_CONFIG.MEDICATION.itemsPerPage;

  // 서브타입 기반 분류 함수들
  const isCareSubType = (subType) => {
    return ["WALK", "BIRTHDAY", "GROOMING", "ETC"].includes(subType);
  };

  const isVaccinationSubType = (subType) => {
    return ["VACCINE", "CHECKUP"].includes(subType);
  };

  // 백엔드에서 돌봄/접종 일정 가져오기
  const fetchCareSchedules = useCallback(async () => {
    if (!selectedPetNo) return;

    try {
      console.log("돌봄/접종 일정 조회 시작:", {
        selectedPetNo,
        selectedPetName,
      });
      const schedules = await listCareSchedules({ petNo: selectedPetNo });
      console.log("돌봄/접종 일정 조회 결과:", schedules);

      if (schedules && Array.isArray(schedules)) {
        // 백엔드 응답을 프론트엔드 형식으로 변환
        const transformedSchedules = schedules.map((schedule) => {
          // scheduleNo가 객체인 경우 숫자 값 추출
          let scheduleNo;
          if (
            typeof schedule.scheduleNo === "object" &&
            schedule.scheduleNo !== null
          ) {
            scheduleNo =
              schedule.scheduleNo.scheduleNo ||
              schedule.scheduleNo.id ||
              schedule.scheduleNo.value ||
              schedule.scheduleNo.data;
          } else {
            scheduleNo = schedule.scheduleNo;
          }

          // id도 scheduleNo와 동일하게 처리
          let id;
          if (typeof schedule.id === "object" && schedule.id !== null) {
            id =
              schedule.id.id ||
              schedule.id.value ||
              schedule.id.data ||
              scheduleNo;
          } else {
            id = schedule.id || scheduleNo;
          }

          return {
            id: id,
            scheduleNo: scheduleNo,
            calNo: scheduleNo, // scheduleNo를 calNo로 매핑
            name: schedule.title, // 백엔드의 title을 name으로 매핑
            title: schedule.title,
            subType: schedule.subType,
            frequency: schedule.frequency, // 백엔드에서 frequency 필드로 한글 값 반환
            careFrequency: schedule.frequency, // 호환성 유지
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            scheduleTime: schedule.times
              ? schedule.times
                  .map((time) => {
                    // "08:00:00" -> "08:00" 변환
                    if (time && time.includes(":")) {
                      const parts = time.split(":");
                      if (parts.length >= 2) {
                        return `${parts[0]}:${parts[1]}`;
                      }
                    }
                    return time;
                  })
                  .join(", ")
              : "09:00", // times 배열을 문자열로 변환
            reminderDaysBefore: schedule.reminderDaysBefore,
            lastReminderDaysBefore: schedule.lastReminderDaysBefore, // 마지막 알림 시기 추가
            isNotified:
              schedule.alarmEnabled !== undefined
                ? schedule.alarmEnabled
                : schedule.reminderDaysBefore !== null, // alarmEnabled 우선 사용
            petName: selectedPetName,
            color: schedule.color || "#4CAF50",
            // 기존 필드들도 유지 (호환성)
            date: schedule.startDate, // startDate를 date로도 매핑
          };
        });

        // 서브타입에 따라 돌봄과 접종으로 분류
        const careSchedulesData = transformedSchedules.filter((schedule) =>
          isCareSubType(schedule.subType)
        );
        const vaccinationSchedulesData = transformedSchedules.filter(
          (schedule) => isVaccinationSubType(schedule.subType)
        );

        // 최신순으로 정렬 (id가 큰 순서대로) - 돌봄과 접종 모두
        const sortedCareSchedules = careSchedulesData.sort((a, b) => {
          const idA = parseInt(a.id) || 0;
          const idB = parseInt(b.id) || 0;
          return idB - idA; // 내림차순 (최신이 위로)
        });

        const sortedVaccinationSchedules = vaccinationSchedulesData.sort(
          (a, b) => {
            const idA = parseInt(a.id) || 0;
            const idB = parseInt(b.id) || 0;
            return idB - idA; // 내림차순 (최신이 위로)
          }
        );

        console.log("분류된 돌봄 일정 (최신순 정렬):", sortedCareSchedules);
        console.log(
          "분류된 접종 일정 (최신순 정렬):",
          sortedVaccinationSchedules
        );

        onCareSchedulesUpdate(sortedCareSchedules);
        onVaccinationSchedulesUpdate(sortedVaccinationSchedules);
      } else {
        console.log("돌봄/접종 일정 데이터가 없습니다.");
        onCareSchedulesUpdate([]);
        onVaccinationSchedulesUpdate([]);
      }
    } catch (error) {
      console.error("돌봄/접종 일정 조회 실패:", error);
      onCareSchedulesUpdate([]);
      onVaccinationSchedulesUpdate([]);
    }
  }, [selectedPetNo, selectedPetName]);

  // 투약 데이터 가져오기 (훅의 함수 사용)
  const handleFetchMedications = useCallback(async () => {
    await fetchMedications(medicationFilter);
  }, [fetchMedications, medicationFilter]);

  // 컴포넌트 마운트 시 및 선택된 펫 변경 시 데이터 가져오기
  useEffect(() => {
    handleFetchMedications();
    fetchCareSchedules();
  }, [selectedPetNo, handleFetchMedications]);

  // fetchCareSchedules 함수를 상위 컴포넌트로 전달
  useEffect(() => {
    if (onRefreshCareSchedules) {
      onRefreshCareSchedules(fetchCareSchedules);
    }
  }, [fetchCareSchedules, onRefreshCareSchedules]);

  // 필터 변경 시 투약 데이터 다시 가져오기
  useEffect(() => {
    if (selectedPetNo) {
      handleFetchMedications();
    }
  }, [medicationFilter, selectedPetNo, handleFetchMedications]);

  // 특정 날짜와 "HH:MM" 문자열로 Date 만들기 - buildCalendarEvents 이전에 선언
  const dateAtTime = useCallback((baseDate, hm) => {
    const [hh = 9, mm = 0] = (hm || "09:00")
      .split(":")
      .map((n) => parseInt(n.trim(), 10));
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hh,
      mm,
      0, // 초는 항상 0으로 설정
      0 // 밀리초도 0으로 설정
    );
  }, []);

  // 캘린더 이벤트 구성 (투약 + 돌봄 + 접종 모두 포함) - useEffect 이전에 선언
  const buildCalendarEvents = useCallback(() => {
    const events = [];

    // 1) 투약: 기간 동안 매일, scheduleTime(콤마 구분) 각각 이벤트 생성
    // 선택된 펫의 투약만 필터링
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
              const s = dateAtTime(current, hm);
              const e = new Date(s.getTime() + 60 * 60 * 1000); // 1시간 후
              events.push({
                id: `med-${med.id}-${current.toISOString().slice(0, 10)}-${hm}`,
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

    // 2) 돌봄 - 선택된 펫의 일정만 필터링
    careSchedules
      .filter((s) => !selectedPetName || s.petName === selectedPetName)
      .forEach((s) => {
        if (!s.date && !s.startDate) return;

        const startDate = new Date(s.startDate || s.date);
        const endDate = new Date(s.endDate || s.date);
        const frequency = s.frequency || s.careFrequency;
        // 백엔드에서 받은 영어 enum을 한글로 변환
        const koreanFrequency = careFrequencyMapping[frequency] || frequency;

        // 빈도에 따른 일정 생성
        if (koreanFrequency === "당일") {
          // 당일: 시작일 하루만
          const sTime = dateAtTime(startDate, s.scheduleTime || "09:00");
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          events.push({
            id: `care-${s.id}-${startDate.toISOString().slice(0, 10)}`,
            title: `${s.icon || "🐕"} ${s.name}`,
            start: sTime,
            end: eTime,
            allDay: false,
            type: s.subType || "산책",
            schedule: { ...s, category: "care" },
          });
        } else if (koreanFrequency === "매일") {
          // 매일: 시작일부터 종료일까지 모든 날
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "09:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `care-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "🐕"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType || "산책",
              schedule: { ...s, category: "care" },
            });
            current.setDate(current.getDate() + 1);
          }
        } else if (koreanFrequency === "매주") {
          // 매주: 7일마다
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "09:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `care-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "🐕"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType || "산책",
              schedule: { ...s, category: "care" },
            });
            current.setDate(current.getDate() + 7);
          }
        } else if (koreanFrequency === "매월") {
          // 매월: 매월 같은 날짜
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "09:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `care-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "🐕"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType || "산책",
              schedule: { ...s, category: "care" },
            });
            current.setMonth(current.getMonth() + 1);
          }
        } else {
          // 기존 로직 (빈도가 없는 경우)
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "09:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `care-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "🐕"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType || "산책",
              schedule: { ...s, category: "care" },
            });
            current.setDate(current.getDate() + 1);
          }
        }
      });

    // 3) 접종 일정 - 선택된 펫의 일정만 필터링
    vaccinationSchedules
      .filter((s) => !selectedPetName || s.petName === selectedPetName)
      .forEach((s) => {
        if (!s.date && !s.startDate) return;

        const startDate = new Date(s.startDate || s.date);
        const endDate = new Date(s.endDate || s.date);
        const frequency = s.frequency || s.careFrequency;
        // 백엔드에서 받은 영어 enum을 한글로 변환
        const koreanFrequency =
          vaccinationFrequencyMapping[frequency] || frequency;

        // 빈도에 따른 일정 생성
        if (koreanFrequency === "당일") {
          // 당일: 시작일 하루만
          const sTime = dateAtTime(startDate, s.scheduleTime || "10:00");
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          events.push({
            id: `vac-${s.id}-${startDate.toISOString().slice(0, 10)}`,
            title: `${s.icon || "💉"} ${s.name}`,
            start: sTime,
            end: eTime,
            allDay: false,
            type: s.subType === "건강검진" ? "건강검진" : "예방접종",
            schedule: {
              ...s,
              category: s.subType === "건강검진" ? "checkup" : "vaccination",
            },
          });
        } else if (koreanFrequency === "매일") {
          // 매일: 시작일부터 종료일까지 모든 날
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "10:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `vac-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "💉"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType === "건강검진" ? "건강검진" : "예방접종",
              schedule: {
                ...s,
                category: s.subType === "건강검진" ? "checkup" : "vaccination",
              },
            });
            current.setDate(current.getDate() + 1);
          }
        } else if (koreanFrequency === "매주") {
          // 매주: 7일마다
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "10:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `vac-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "💉"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType === "건강검진" ? "건강검진" : "예방접종",
              schedule: {
                ...s,
                category: s.subType === "건강검진" ? "checkup" : "vaccination",
              },
            });
            current.setDate(current.getDate() + 7);
          }
        } else if (koreanFrequency === "매월") {
          // 매월: 매월 같은 날짜
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "10:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `vac-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "💉"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType === "건강검진" ? "건강검진" : "예방접종",
              schedule: {
                ...s,
                category: s.subType === "건강검진" ? "checkup" : "vaccination",
              },
            });
            current.setMonth(current.getMonth() + 1);
          }
        } else {
          // 기존 로직 (빈도가 없는 경우)
          const current = new Date(startDate);
          while (current <= endDate) {
            const sTime = dateAtTime(current, s.scheduleTime || "10:00");
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
              id: `vac-${s.id}-${current.toISOString().slice(0, 10)}`,
              title: `${s.icon || "💉"} ${s.name}`,
              start: sTime,
              end: eTime,
              allDay: false,
              type: s.subType === "건강검진" ? "건강검진" : "예방접종",
              schedule: {
                ...s,
                category: s.subType === "건강검진" ? "checkup" : "vaccination",
              },
            });
            current.setDate(current.getDate() + 1);
          }
        }
      });

    return events;
  }, [
    medications,
    careSchedules,
    vaccinationSchedules,
    dateAtTime,
    selectedPetName,
  ]);

  // 캘린더 이벤트를 상위 컴포넌트로 전달 - buildCalendarEvents 의존성 추가
  useEffect(() => {
    if (onCalendarEventsChange) {
      const events = buildCalendarEvents();
      setCalendarEvents(events); // 캘린더 이벤트 상태 업데이트
      onCalendarEventsChange(events);
    }
  }, [
    medications,
    careSchedules,
    vaccinationSchedules,
    selectedPetName,
    onCalendarEventsChange,
    buildCalendarEvents,
  ]);

  // 로컬 스토리지에서 알림 상태 복원
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const savedStatus = JSON.parse(saved);
        // 훅의 상태는 자동으로 업데이트되므로 여기서는 로그만 출력
        console.log("로컬 스토리지에서 알림 상태 복원:", savedStatus);
      } catch (e) {
        console.error("알림 상태 복원 실패:", e);
      }
    }
  }, []);

  const handleToggleNotification = async (id) => {
    try {
      const result = await toggleNotification(id);

      if (result.success) {
        const medication = medications.find((med) => med.id === id);

        // 로컬 스토리지 업데이트
        const updatedStatus = medications.reduce((acc, med) => {
          acc[med.id] = med.id === id ? result.isNotified : med.isNotified;
          return acc;
        }, {});
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStatus));

        setToastMessage(
          `${medication?.name} 일정 알림이 ${
            result.isNotified ? "활성화" : "비활성화"
          } 되었습니다.`
        );
        setToastType(result.isNotified ? "active" : "inactive");
        setShowToast(true);
      } else {
        setToastMessage("알림 설정 변경에 실패했습니다.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      console.error("알림 토글 실패:", error);
      setToastMessage("알림 설정 변경에 실패했습니다.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && selectedPetNo) {
      try {
        // 파일 검증
        console.log("🔍 파일 검증 시작");
        console.log("🔍 파일 객체:", file);
        console.log("🔍 파일이 File 인스턴스인가?", file instanceof File);
        console.log("🔍 파일 크기:", file.size, "bytes");
        console.log("🔍 파일 타입:", file.type);

        // 파일 크기 제한
        if (file.size > FILE_UPLOAD_CONFIG.MAX_SIZE) {
          setErrorMessage(MEDICATION_MESSAGES.OCR_FILE_TOO_LARGE);
          setErrorDetails(
            `파일 크기는 ${
              FILE_UPLOAD_CONFIG.MAX_SIZE / (1024 * 1024)
            }MB 이하여야 합니다.`
          );
          setShowErrorModal(true);
          return;
        }

        // 지원하는 이미지 형식 확인
        if (!FILE_UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
          setErrorMessage(MEDICATION_MESSAGES.OCR_INVALID_FORMAT);
          setErrorDetails("JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
          setShowErrorModal(true);
          return;
        }

        console.log("🔍 파일 검증 완료, OCR 처리 시작");

        // 훅의 processPrescription 함수 사용
        const result = await processPrescription(file);

        if (result.success) {
          setOcrResult(result.data);
          setShowResultModal(true);
        } else {
          setErrorMessage(result.error || "처방전 처리에 실패했습니다.");
          setErrorDetails(
            result.details ||
              "처방전 이미지가 불분명하거나 약물 정보가 명확하지 않습니다."
          );
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("❌ 처방전 OCR 처리 실패:", error);
        setErrorMessage("처방전 처리에 실패했습니다.");
        setErrorDetails(error.message);
        setShowErrorModal(true);
      }
    } else if (!selectedPetNo) {
      setToastMessage("반려동물을 선택해주세요.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleAddMedication = () => setShowAddModal(true);

  // 복용 빈도에 따른 기본 시간 설정과 약물 아이콘은 constants에서 import

  const handleAddNewMedication = async (newMedication) => {
    try {
      setIsLoadingAction(true);
      console.log("🔍 MedicationManagement - 투약 추가 요청:", newMedication);

      const result = await addMedication(newMedication);

      if (result.success) {
        setToastMessage(`${newMedication.name}이(가) 추가되었습니다.`);
        setToastType("active");
        setShowToast(true);

        // 즉시 서버에서 최신 데이터 가져오기
        setMedicationFilter("전체"); // 필터를 "전체"로 리셋
        await handleFetchMedications();

        // 돌봄/접종 일정도 새로고침
        if (onRefreshCareSchedules) {
          await onRefreshCareSchedules();
        }
      } else {
        setToastMessage("투약 추가에 실패했습니다.");
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      console.error("투약 추가 실패:", error);
      setToastMessage("투약 추가에 실패했습니다.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleEditMedication = (id) => {
    const medication = medications.find((med) => med.id === id);
    if (medication) {
      setEditingMedication(medication);
      setShowEditModal(true);
    }
  };

  const handleEditMedicationSubmit = async (updatedMedication) => {
    try {
      setIsLoadingAction(true);

      const medication = medications.find(
        (med) => med.id === updatedMedication.id
      );
      if (!medication || !medication.calNo) {
        console.error("투약 정보를 찾을 수 없습니다.");
        return { success: false, error: "투약 정보를 찾을 수 없습니다." };
      }

      // 처방전 약의 알림 시기 변경 제한
      if (
        medication.isPrescription &&
        updatedMedication.reminderDaysBefore !== 0
      ) {
        setToastMessage(
          "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다."
        );
        setToastType("error");
        setShowToast(true);
        return {
          success: false,
          error: "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다.",
        };
      }

      // updateMedicationData API 호출
      const result = await updateMedicationData(
        updatedMedication.id,
        updatedMedication
      );

      if (result.success) {
        setToastMessage(`${updatedMedication.name}이(가) 수정되었습니다.`);
        setToastType("active");
        setShowToast(true);

        // 즉시 서버에서 최신 데이터 가져오기
        await handleFetchMedications();

        // 돌봄/접종 일정도 새로고침
        if (onRefreshCareSchedules) {
          await onRefreshCareSchedules();
        }

        return { success: true };
      } else {
        setToastMessage("투약 수정에 실패했습니다.");
        setToastType("error");
        setShowToast(true);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("투약 수정 실패:", error);

      // 403 에러인 경우 처방전 관련 메시지 표시
      if (error.response?.status === 403) {
        setToastMessage(
          "처방전으로 등록된 약은 알림 시기를 변경할 수 없습니다."
        );
      } else {
        setToastMessage("투약 수정에 실패했습니다.");
      }

      setToastType("error");
      setShowToast(true);
      return { success: false, error: error.message };
    } finally {
      setIsLoadingAction(false);
    }
  };

  const requestDeleteMedication = (id) => {
    setToDeleteId(id);
    setDeleteType("medication");
    setShowConfirm(true);
  };

  const confirmDeleteMedication = async () => {
    if (toDeleteId == null) return;

    try {
      setIsLoadingAction(true);

      if (deleteType === "medication") {
        const result = await removeMedication(toDeleteId);

        if (result.success) {
          // 로컬 스토리지에서도 삭제
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            delete parsed[toDeleteId];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
          }

          // 토스트 메시지 표시
          const deletedMed = medications.find((med) => med.id === toDeleteId);
          if (deletedMed) {
            setToastMessage(`${deletedMed.name}이(가) 삭제되었습니다.`);
            setToastType("delete");
            setShowToast(true);
          }

          // 즉시 서버에서 최신 데이터 가져오기
          await handleFetchMedications();

          // 돌봄/접종 일정도 새로고침
          if (onRefreshCareSchedules) {
            await onRefreshCareSchedules();
          }
        } else {
          setToastMessage("투약 삭제에 실패했습니다.");
          setToastType("error");
          setShowToast(true);
          return;
        }
      } else if (deleteType === "care" || deleteType === "vaccination") {
        // 돌봄/접종 일정 삭제는 CareManagement에서 처리
        // 여기서는 서버에서 최신 데이터만 가져오기
        if (onRefreshCareSchedules) {
          await onRefreshCareSchedules();
        }
      }

      setShowConfirm(false);
      setToDeleteId(null);
      setDeleteType("");
    } catch (error) {
      console.error("삭제 실패:", error);
      setToastMessage("삭제에 실패했습니다.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const cancelDeleteMedication = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  // 백엔드에서 이미 필터링된 데이터를 사용하므로 추가 필터링 불필요
  const filteredMedications = medications; // 최신순 정렬 (ID 내림차순)
  const paginatedMedications = paginateArray(
    filteredMedications,
    medicationPage,
    itemsPerPage
  );

  // 페이징 핸들러
  const handleMedicationPageChange = (page) => {
    setMedicationPage(page);
  };

  // 페이징 렌더링
  const renderPagination = (currentPage, totalPages, onPageChange) => {
    const pages = [];
    const maxVisible = 3; // 최대 3페이지까지만 표시

    // 페이지 번호 생성
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 1) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 1; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return (
      <div className={styles.pagination}>
        {/* 이전 버튼 */}
        {currentPage > 1 && (
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage - 1)}
            title="이전 페이지"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M7.5 3L4.5 6L7.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* 페이지 번호들 */}
        {pages.map((page, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.activePage : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* 다음 버튼 */}
        {currentPage < totalPages && (
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage + 1)}
            title="다음 페이지"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M4.5 3L7.5 6L4.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };

  // 일정 상세 모달 핸들러
  const handleDetailModalEdit = () => {
    console.log("handleDetailModalEdit called", selectedSchedule);
    if (selectedSchedule) {
      setEditingMedication(selectedSchedule);
      setShowDetailModal(false);
      setShowEditModal(true);
    }
  };

  const handleDetailModalDelete = async () => {
    if (selectedSchedule) {
      // selectedSchedule.schedule에서 원본 schedule의 id를 가져옴
      let scheduleId = selectedSchedule.id;

      // selectedSchedule.schedule이 있는 경우 (캘린더 이벤트에서 클릭한 경우)
      if (selectedSchedule.schedule && selectedSchedule.schedule.id) {
        scheduleId = selectedSchedule.schedule.id;
      } else if (
        typeof selectedSchedule.id === "string" &&
        selectedSchedule.id.startsWith("med-")
      ) {
        // 캘린더 이벤트의 id에서 원본 medication의 id 추출 (fallback)
        const parts = selectedSchedule.id.split("-");
        if (parts.length >= 2) {
          scheduleId = parseInt(parts[1], 10); // 숫자로 변환
        }
      }

      // 일정 타입에 따라 삭제 처리
      if (
        selectedSchedule.category === "medication" ||
        selectedSchedule.type === "medication" ||
        (selectedSchedule.schedule &&
          selectedSchedule.schedule.category === "medication")
      ) {
        try {
          const medication = medications.find((med) => med.id === scheduleId);
          if (!medication || !medication.calNo) {
            console.error("투약 정보를 찾을 수 없습니다.");
            return;
          }

          await deleteMedication(medication.calNo);

          // 성공 시 로컬 상태에서 제거
          const updated = medications.filter((med) => med.id !== scheduleId);
          onMedicationsUpdate(updated);

          // 로컬 스토리지에서도 삭제
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            delete parsed[scheduleId];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
          }

          setToastMessage(
            `${
              selectedSchedule.name || selectedSchedule.title
            }이(가) 삭제되었습니다.`
          );
        } catch (error) {
          console.error("투약 삭제 실패:", error);
          setToastMessage("투약 삭제에 실패했습니다.");
          setToastType("error");
          setShowToast(true);
          return;
        }
      } else if (
        selectedSchedule.category === "care" ||
        selectedSchedule.type === "care" ||
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
        selectedSchedule.type === "vaccination" ||
        selectedSchedule.type === "checkup" ||
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

  // 반려동물이 선택되지 않았을 때 안내 섹션 표시
  if (!selectedPetName || !selectedPetNo) {
    return (
      <div className={styles.container}>
        <div className={styles.noPetSection}>
          <div className={styles.noPetArea}>
            <div className={styles.noPetIcon}>🐕</div>
            <div className={styles.noPetText}>
              <h3>반려동물을 선택해주세요</h3>
              <p>투약 일정을 관리하려면 먼저 반려동물을 선택해주세요!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 처방전 사진 업로드 */}
      <div className={styles.prescriptionSection}>
        <div className={styles.uploadArea}>
          <div className={styles.uploadIcon}>
            <img
              src="/health/camera.png"
              alt="처방전 업로드"
              width="20"
              height="20"
            />
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
          <h3>투약</h3>
          <div className={styles.headerControls}>
            <div className={styles.filterContainer}>
              <MedicalFilter
                type="medication"
                options={medicationFilterOptions}
                value={medicationFilter}
                onChange={setMedicationFilter}
                className={styles.filterSelect}
              />
            </div>
            <button
              className={styles.addButton}
              onClick={handleAddMedication}
              disabled={isLoadingAction}
            >
              <span>{isLoadingAction ? "처리중..." : "추가"}</span>
              <img
                src="health/pill.png"
                alt="복용약 추가 아이콘"
                width="17"
                height="17"
                className={styles.icon}
              />
            </button>
          </div>
        </div>

        <div className={styles.medicationList}>
          {isLoading ? (
            <LoadingSpinner
              message={MEDICATION_LABELS.LOADING_MEDICATIONS}
              className={styles.loadingContainer}
            />
          ) : paginatedMedications.length === 0 ? (
            <EmptyState type="medication" className={styles.emptyContainer} />
          ) : (
            paginatedMedications.map((medication, index) => (
              <MedicationCard
                key={`medication-${medication.id || medication.calNo || index}`}
                medication={medication}
                onEdit={handleEditMedication}
                onDelete={requestDeleteMedication}
                onToggleNotification={handleToggleNotification}
              />
            ))
          )}
        </div>

        {/* 페이징 */}
        {filteredMedications.length > itemsPerPage && (
          <div className={styles.pagination}>
            {renderPagination(
              medicationPage,
              Math.ceil(filteredMedications.length / itemsPerPage),
              handleMedicationPageChange
            )}
          </div>
        )}
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

      {/* 에러 모달 */}
      <PrescriptionErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage}
        errorDetails={errorDetails}
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
