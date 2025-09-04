"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/MedicationManagement.module.css";
import { useSelectedPet } from "../../context/SelectedPetContext";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import AddMedicationModal from "./AddMedicationModal";
import EditScheduleModal from "./EditScheduleModal";
import PrescriptionResultModal from "./PrescriptionResultModal";
import PrescriptionErrorModal from "./PrescriptionErrorModal";
import ScheduleDetailModal from "./ScheduleDetailModal";
import Select from "../../activity/components/ClientOnlySelect";
import {
  createMedication,
  listMedications,
  updateMedication,
  toggleAlarm,
  deleteMedication,
  processPrescription,
  createMedicationFromOcr,
  listCareSchedules,
} from "../../../../api/medicationApi";
import { STORAGE_KEYS, frequencyMapping } from "../../constants";
import { COLOR_MAP } from "../../constants/colors";

export default function MedicationManagement({
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
  const LOCAL_STORAGE_KEY = STORAGE_KEYS.MEDICATION_NOTIFICATIONS;

  // 투약 일정 필터 옵션
  const medicationFilterOptions = [
    { value: "전체", label: "전체" },
    { value: "복용약", label: "복용약" },
    { value: "영양제", label: "영양제" },
    { value: "처방전", label: "처방전" },
  ];

  // 빈도 매핑 (한글 → Enum)
  const frequencyToEnum = {
    "하루에 한 번": "DAILY_ONCE",
    "하루에 두 번": "DAILY_TWICE",
    "하루에 세 번": "DAILY_THREE_TIMES",
    "주에 한 번": "WEEKLY_ONCE",
    "월에 한 번": "MONTHLY_ONCE",
  };

  // 타입 매핑 (한글 → Enum)
  const typeToEnum = {
    복용약: "PILL",
    영양제: "SUPPLEMENT",
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "medication", "care", "vaccination"
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  // 투약 일정 필터링 상태
  const [medicationFilter, setMedicationFilter] = useState("전체");

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("inactive");
  const [showToast, setShowToast] = useState(false);

  // OCR 결과 모달 상태
  const [showResultModal, setShowResultModal] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // OCR 에러 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");

  // 페이징 상태
  const [medicationPage, setMedicationPage] = useState(1);
  const itemsPerPage = 3;

  // 캘린더 이벤트 상태 (돌봄 일정과 동일하게 추가)
  const [calendarEvents, setCalendarEvents] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

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

  // 백엔드에서 투약 데이터 가져오기
  const fetchMedications = useCallback(async () => {
    if (!selectedPetNo) return;

    try {
      setIsLoading(true);

      // 필터링 파라미터 구성
      const params = { petNo: selectedPetNo };

      if (medicationFilter !== "전체") {
        if (medicationFilter === "처방전") {
          params.isPrescription = true;
        } else {
          // 한글 타입을 Enum으로 변환
          params.type = typeToEnum[medicationFilter] || medicationFilter;
        }
      }

      console.log("투약 일정 필터링 파라미터:", params);
      console.time("투약 데이터 조회 시간");
      const response = await listMedications(params);
      console.timeEnd("투약 데이터 조회 시간");

      // response가 배열인지 확인
      if (!Array.isArray(response)) {
        console.warn("투약 데이터가 배열이 아닙니다:", response);
        onMedicationsUpdate([]);
        return;
      }

      // 백엔드 응답을 프론트엔드 형식으로 변환
      console.log("투약 목록 원본 데이터:", response);
      console.log(
        "첫 번째 투약 데이터 isPrescription:",
        response[0]?.isPrescription
      );
      const transformedMedications = response.map((med) => {
        return {
          id: med.scheduleNo,
          calNo: med.scheduleNo,
          name: med.medicationName || med.title, // medicationName 또는 title 사용
          type: med.subType,
          frequency: med.frequency,
          duration: med.durationDays,
          startDate: med.startDate
            ? new Date(med.startDate).toISOString().split("T")[0]
            : "",
          endDate: med.endDate
            ? new Date(med.endDate).toISOString().split("T")[0]
            : "",
          scheduleTime: med.times
            ? med.times
                .map((t) => {
                  // 시간 문자열에서 초 제거 (예: "09:00:00" -> "09:00")
                  if (typeof t === "string" && t.includes(":")) {
                    const parts = t.split(":");
                    if (parts.length >= 2) {
                      return `${parts[0]}:${parts[1]}`;
                    }
                  }
                  return t;
                })
                .join(", ")
            : "09:00",
          reminderDaysBefore: med.reminderDaysBefore,
          lastReminderDaysBefore: med.lastReminderDaysBefore,
          isPrescription: med.isPrescription || false,
          petName: selectedPetName,
          petNo: selectedPetNo,
          icon: med.subType === "복용약" ? "💊" : "💊",
          color: med.subType === "복용약" ? "#E3F2FD" : "#FFF3E0",
          isNotified: med.alarmEnabled || false,
        };
      });

      // 최신순으로 정렬 (id가 큰 순서대로)
      const sortedMedications = transformedMedications.sort((a, b) => {
        const idA = parseInt(a.id) || 0;
        const idB = parseInt(b.id) || 0;
        return idB - idA; // 내림차순 (최신이 위로)
      });

      console.log("변환된 투약 데이터 (최신순 정렬):", sortedMedications);
      onMedicationsUpdate(sortedMedications);
    } catch (error) {
      console.error("투약 데이터 가져오기 실패:", error);
      // 404 에러가 아닌 경우에만 에러 메시지 표시
      if (error.response?.status !== 404) {
        setToastMessage("투약 데이터를 가져오는데 실패했습니다.");
        setToastType("error");
        setShowToast(true);
      } else {
        // 404 에러인 경우 빈 배열로 설정 (데이터가 없는 상태)
        onMedicationsUpdate([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedPetNo, selectedPetName, medicationFilter]);

  // 컴포넌트 마운트 시 및 선택된 펫 변경 시 데이터 가져오기
  useEffect(() => {
    fetchMedications();
    fetchCareSchedules();
  }, [selectedPetNo]);

  // 필터 변경 시 투약 데이터 다시 가져오기
  useEffect(() => {
    if (selectedPetNo) {
      fetchMedications();
    }
  }, [medicationFilter, selectedPetNo]);

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

        // 백엔드에서 주기적 일정을 여러 개 생성하므로, 모든 일정을 그대로 표시
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
            // 캘린더 필터와 색상 매핑을 위해 돌봄 하위유형(산책/미용/생일)로 설정
            type: s.subType || "산책",
            schedule: { ...s, category: "care" },
          });
          current.setDate(current.getDate() + 1);
        }
      });

    // 3) 접종 일정 - 선택된 펫의 일정만 필터링
    vaccinationSchedules
      .filter((s) => !selectedPetName || s.petName === selectedPetName)
      .forEach((s) => {
        if (!s.date && !s.startDate) return;

        const startDate = new Date(s.startDate || s.date);
        const endDate = new Date(s.endDate || s.date);

        // 백엔드에서 주기적 일정을 여러 개 생성하므로, 모든 일정을 그대로 표시
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
            // 캘린더 필터와 색상 매핑을 위해 접종 하위유형(예방접종/건강검진)로 설정
            type: s.subType === "건강검진" ? "건강검진" : "예방접종",
            schedule: {
              ...s,
              // 상세 모달 등 내부 로직을 위해 category는 영문 키로 유지
              category: s.subType === "건강검진" ? "checkup" : "vaccination",
            },
          });
          current.setDate(current.getDate() + 1);
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
        const updatedMedications = medications.map((med) => ({
          ...med,
          isNotified: savedStatus[med.id] ?? med.isNotified,
        }));
        onMedicationsUpdate(updatedMedications);
      } catch (e) {
        console.error("알림 상태 복원 실패:", e);
      }
    }
  }, []);

  const toggleNotification = async (id) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (!medication || !medication.calNo) {
        console.error("투약 정보를 찾을 수 없습니다.");
        return;
      }

      // calNo가 객체인 경우 숫자 값 추출
      let calNo = medication.calNo;
      if (typeof calNo === "object" && calNo !== null) {
        calNo = calNo.scheduleNo || calNo.id || calNo.value || calNo.data;
        console.warn("calNo가 객체였습니다. 변환:", {
          original: medication.calNo,
          converted: calNo,
        });
      }

      console.log("알림 토글 요청:", {
        id,
        medication,
        calNo: calNo,
        calNoType: typeof calNo,
      });

      // 백엔드에서 알림 토글 및 마지막 알림 시기 자동 복원
      const newAlarmStatus = await toggleAlarm(calNo);

      // 백엔드에서 업데이트된 데이터를 다시 가져와서 상태 동기화
      await fetchMedications();

      // 로컬 스토리지 업데이트
      const updatedStatus = medications.reduce((acc, med) => {
        acc[med.id] =
          med.id === id ? newAlarmStatus : med.reminderDaysBefore !== null;
        return acc;
      }, {});
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedStatus));

      setToastMessage(
        `${medication.name} 일정 알림이 ${
          newAlarmStatus ? "활성화" : "비활성화"
        } 되었습니다.`
      );
      setToastType(newAlarmStatus ? "active" : "inactive");
      setShowToast(true);
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
        setIsLoading(true);

        // 파일 검증
        console.log("🔍 파일 검증 시작");
        console.log("🔍 파일 객체:", file);
        console.log("🔍 파일이 File 인스턴스인가?", file instanceof File);
        console.log("🔍 파일 크기:", file.size, "bytes");
        console.log("🔍 파일 타입:", file.type);
        console.log(
          "🔍 selectedPetNo:",
          selectedPetNo,
          "타입:",
          typeof selectedPetNo
        );

        // 파일 크기 제한 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          setErrorMessage("파일 크기가 너무 큽니다.");
          setErrorDetails("파일 크기는 10MB 이하여야 합니다.");
          setShowErrorModal(true);
          return;
        }

        // 지원하는 이미지 형식 확인
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
          setErrorMessage("지원하지 않는 파일 형식입니다.");
          setErrorDetails("JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
          setShowErrorModal(true);
          return;
        }

        console.log("🔍 파일 검증 완료, OCR 처리 시작");

        // OCR 처방전 분석 및 일정 자동 등록
        const result = await createMedicationFromOcr(file, selectedPetNo);

        console.log("🔍 OCR 처리 결과:", result);

        // 성공적인 응답인지 확인
        if (result && result.code === "2000" && result.createdSchedules > 0) {
          // 성공적으로 일정이 등록된 경우
          setOcrResult({
            success: true,
            createdSchedules: result.createdSchedules,
            scheduleNo: result.scheduleNo,
            message: result.message,
            data: result.data, // 약물 정보 포함
          });
          setShowResultModal(true);

          // 데이터 새로고침
          await fetchMedications();
        } else if (result && result.code === "9000") {
          // 서버 내부 오류
          setErrorMessage("서버 내부 오류가 발생했습니다.");
          setErrorDetails(
            `🔍 오류 정보:\n- 오류 코드: ${result.code}\n- 오류 메시지: ${
              result.message
            }\n\n📋 백엔드 개발자에게 전달할 정보:\n- 파일명: ${
              file.name
            }\n- 파일 크기: ${file.size} bytes (${(file.size / 1024).toFixed(
              1
            )} KB)\n- 파일 타입: ${
              file.type
            }\n- 반려동물 번호: ${selectedPetNo}\n- 요청 시간: ${new Date().toLocaleString()}\n\n💡 확인 사항:\n1. OCR 라이브러리 상태 확인\n2. 한국어 언어팩 설치 여부\n3. JVM 메모리 설정 확인\n4. 상세한 예외 스택 트레이스 확인`
          );
          setShowErrorModal(true);
        } else {
          // OCR 처리는 성공했지만 약물 정보가 없거나 등록 실패한 경우
          setErrorMessage("처방전에서 약물 정보를 찾을 수 없습니다.");
          setErrorDetails(
            "처방전 이미지가 불분명하거나 약물 정보가 명확하지 않습니다."
          );
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("❌ 처방전 OCR 처리 실패:", error);
        console.error("❌ 에러 상세:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
        });

        // 에러 메시지 설정
        let message = "처방전 처리에 실패했습니다.";
        let details = "";

        if (error.response) {
          // 서버 응답이 있는 경우
          const status = error.response.status;
          const data = error.response.data;

          console.log("❌ 서버 응답 에러:", { status, data });

          switch (status) {
            case 400:
              message = "처방전 형식이 올바르지 않습니다.";
              details = `서버 응답: ${data?.message || "잘못된 요청"}`;
              break;
            case 401:
              message = "로그인이 필요하거나 권한이 없습니다.";
              details = "로그인 상태를 확인하고 다시 시도해주세요.";
              break;
            case 413:
              message = "파일 크기가 너무 큽니다.";
              details = "파일 크기를 줄여서 다시 시도해주세요.";
              break;
            case 500:
              message = "서버에서 처방전을 처리하는데 실패했습니다.";
              details = `서버 오류: ${data?.message || "내부 서버 오류"}`;
              break;
            default:
              message = "처방전 처리 중 오류가 발생했습니다.";
              details = `HTTP ${status}: ${data?.message || "알 수 없는 오류"}`;
          }
        } else if (error.request) {
          // 네트워크 에러
          console.log("❌ 네트워크 에러:", error.request);
          message = "서버에 연결할 수 없습니다.";
          details = "인터넷 연결을 확인해주세요.";
        } else if (error.code === "ECONNABORTED") {
          // 타임아웃 에러
          console.log("❌ 타임아웃 에러");
          message = "요청 시간이 초과되었습니다.";
          details =
            "OCR 처리 시간이 오래 걸려서 타임아웃되었습니다. 잠시 후 다시 시도해주세요.";
        } else {
          // 기타 에러
          console.log("❌ 기타 에러:", error);
          message = "처방전 업로드 중 오류가 발생했습니다.";
          details = `오류: ${error.message}`;
        }

        setErrorMessage(message);
        setErrorDetails(details);
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    } else if (!selectedPetNo) {
      setToastMessage("반려동물을 선택해주세요.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleAddMedication = () => setShowAddModal(true);

  // 복용 빈도에 따른 기본 시간 설정
  const getDefaultTimes = (frequency) => {
    switch (frequency) {
      case "DAILY_ONCE":
        return ["09:00"];
      case "DAILY_TWICE":
        return ["08:00", "20:00"];
      case "DAILY_THREE_TIMES":
        return ["08:00", "12:00", "20:00"];
      default:
        return ["09:00"];
    }
  };

  // 약물명에 따라 이모지를 결정하는 함수
  const getMedicationIcon = (medicationName) => {
    if (!medicationName) return "💊";

    const name = medicationName.toLowerCase();

    // 항생제
    if (name.includes("amoxicillin") || name.includes("항생제")) {
      return "💊";
    }
    // 소염진통제
    if (
      name.includes("firocoxib") ||
      name.includes("소염") ||
      name.includes("진통")
    ) {
      return "💊";
    }
    // 심장약
    if (name.includes("heart") || name.includes("심장")) {
      return "💊";
    }
    // 비타민/영양제
    if (
      name.includes("vitamin") ||
      name.includes("비타민") ||
      name.includes("영양")
    ) {
      return "💊";
    }
    // 알레르기약
    if (name.includes("allergy") || name.includes("알레르기")) {
      return "💊";
    }
    // 기본 약물 이모지
    return "💊";
  };

  const handleAddNewMedication = async (newMedication) => {
    try {
      // 백엔드 형식으로 데이터 변환
      const medicationData = {
        petNo: selectedPetNo,
        name: newMedication.name, // medicationName → name
        startDate: newMedication.startDate,
        durationDays: newMedication.duration,
        medicationFrequency:
          frequencyToEnum[newMedication.frequency] || "DAILY_ONCE", // 한글 → Enum 변환
        times: newMedication.scheduleTime
          ? newMedication.scheduleTime.split(",").map((t) => {
              const time = t.trim();
              // "09:00" → "09:00:00" (초 포함)
              return time.includes(":") && time.split(":").length === 2
                ? `${time}:00`
                : time;
            })
          : ["09:00:00"],
        subType: newMedication.type === "영양제" ? "SUPPLEMENT" : "PILL", // 영양제/복용약 구분
        isPrescription: newMedication.isPrescription || false, // 처방전 여부
        reminderDaysBefore: parseInt(newMedication.notificationTiming, 10) || 0,
      };

      console.log("투약 일정 등록 데이터:", medicationData);
      const calNo = await createMedication(medicationData);
      console.log("투약 일정 등록 성공, calNo:", calNo);

      // 성공 시 로컬 상태 업데이트
      const updatedMedication = {
        ...newMedication,
        id: calNo,
        calNo: calNo,
        frequency:
          frequencyMapping[newMedication.frequency] || newMedication.frequency, // 영어를 한글로 변환
      };

      // 즉시 로컬 상태 업데이트 (빠른 UI 반응)
      onMedicationsUpdate((prev) => {
        const updated = [...prev, updatedMedication];
        // 최신순으로 정렬
        return updated.sort((a, b) => {
          const idA = parseInt(a.id) || 0;
          const idB = parseInt(b.id) || 0;
          return idB - idA;
        });
      });

      setToastMessage(`${newMedication.name}이(가) 추가되었습니다.`);
      setToastType("active");
      setShowToast(true);

      // 백그라운드에서 데이터 동기화 (1초 후)
      setTimeout(() => {
        setMedicationFilter("전체"); // 필터를 "전체"로 리셋
        fetchMedications();
      }, 1000);

      // 캘린더 이벤트 즉시 업데이트
      const events = buildCalendarEvents();
      setCalendarEvents(events);
      if (onCalendarEventsChange) {
        onCalendarEventsChange(events);
      }
    } catch (error) {
      console.error("투약 추가 실패:", error);
      setToastMessage("투약 추가에 실패했습니다.");
      setToastType("error");
      setShowToast(true);
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
      const medication = medications.find(
        (med) => med.id === updatedMedication.id
      );
      if (!medication || !medication.calNo) {
        console.error("투약 정보를 찾을 수 없습니다.");
        return;
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
        return;
      }

      // 백엔드 형식으로 데이터 변환
      const updateData = {
        name: updatedMedication.name, // medicationName → name
        startDate: updatedMedication.startDate,
        durationDays: updatedMedication.duration,
        medicationFrequency:
          frequencyToEnum[updatedMedication.frequency] || "DAILY_ONCE", // 한글 → Enum 변환
        times: updatedMedication.scheduleTime
          ? updatedMedication.scheduleTime.split(",").map((t) => {
              const time = t.trim();
              // "09:00" → "09:00:00" (초 포함)
              return time.includes(":") && time.split(":").length === 2
                ? `${time}:00`
                : time;
            })
          : ["09:00:00"],
        subType: updatedMedication.type === "영양제" ? "SUPPLEMENT" : "PILL", // 영양제/복용약 구분
        isPrescription: updatedMedication.isPrescription || false, // 처방전 여부
        reminderDaysBefore: updatedMedication.reminderDaysBefore,
      };

      // 백엔드에서 알림 시기 변경 시 자동으로 마지막 알림 시기 저장
      await updateMedication(medication.calNo, updateData);

      // 즉시 로컬 상태 업데이트 (빠른 UI 반응)
      onMedicationsUpdate((prev) =>
        prev.map((med) =>
          med.id === updatedMedication.id ? updatedMedication : med
        )
      );

      setToastMessage(`${updatedMedication.name}이(가) 수정되었습니다.`);
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
        fetchMedications();
      }, 1000);
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
    }
  };

  const requestDeleteMedication = (id) => {
    setToDeleteId(id);
    setDeleteType("medication");
    setShowConfirm(true);
  };

  const confirmDeleteMedication = async () => {
    if (toDeleteId == null) return;

    if (deleteType === "medication") {
      try {
        const medication = medications.find((med) => med.id === toDeleteId);
        if (!medication || !medication.calNo) {
          console.error("투약 정보를 찾을 수 없습니다.");
          return;
        }

        await deleteMedication(medication.calNo);

        // 성공 시 로컬 상태에서 제거
        const updated = medications.filter((med) => med.id !== toDeleteId);
        onMedicationsUpdate(updated);

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
      } catch (error) {
        console.error("투약 삭제 실패:", error);
        setToastMessage("투약 삭제에 실패했습니다.");
        setToastType("error");
        setShowToast(true);
        return;
      }
    } else if (deleteType === "care") {
      // 돌봄 일정 삭제
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
    } else if (deleteType === "vaccination") {
      // 접종 일정 삭제
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
  };

  const cancelDeleteMedication = () => {
    setShowConfirm(false);
    setToDeleteId(null);
  };

  // 백엔드에서 이미 필터링된 데이터를 사용하므로 추가 필터링 불필요
  const filteredMedications = medications; // 최신순 정렬 (ID 내림차순)
  const paginatedMedications = filteredMedications.slice(
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
              <Select
                options={medicationFilterOptions}
                value={medicationFilterOptions.find(
                  (o) => o.value === medicationFilter
                )}
                onChange={(option) => setMedicationFilter(option.value)}
                placeholder="필터 선택"
                className={styles.filterSelect}
              />
            </div>
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
        </div>

        <div className={styles.medicationList}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>투약 데이터를 불러오는 중...</p>
            </div>
          ) : paginatedMedications.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>💊</div>
              <p>등록된 투약 일정이 없습니다.</p>
              <p>새로운 투약 일정을 추가해보세요!</p>
            </div>
          ) : (
            paginatedMedications.map((medication, index) => (
              <div
                key={`medication-${medication.id || medication.calNo || index}`}
                className={styles.medicationCard}
              >
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
                        <span className={styles.prescriptionBadge}>처방전</span>
                      )}
                    </div>
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
                    title={(() => {
                      if (medication.reminderDaysBefore === null) {
                        return `알림 비활성화 (마지막 설정: ${
                          medication.lastReminderDaysBefore || 0
                        }일전)`;
                      } else {
                        return medication.reminderDaysBefore === 0
                          ? "당일 알림"
                          : `${medication.reminderDaysBefore}일 전 알림`;
                      }
                    })()}
                  >
                    <img
                      src={
                        medication.reminderDaysBefore !== null
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
            ))
          )}
        </div>

        {/* 페이징 */}
        {filteredMedications.length > itemsPerPage &&
          renderPagination(
            medicationPage,
            Math.ceil(filteredMedications.length / itemsPerPage),
            handleMedicationPageChange
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
