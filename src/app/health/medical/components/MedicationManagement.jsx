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
import {
  createMedication,
  listMedications,
  updateMedication,
  toggleAlarm,
  deleteMedication,
  processPrescription,
} from "../../../../api/medicationApi";
import { STORAGE_KEYS, mockPrescriptionData } from "../../data/mockData";

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

  const [showConfirm, setShowConfirm] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "medication", "care", "vaccination"
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

  // 백엔드에서 투약 데이터 가져오기
  const fetchMedications = useCallback(async () => {
    if (!selectedPetNo) return;

    try {
      setIsLoading(true);
      const response = await listMedications({
        petNo: selectedPetNo,
      });

      // response가 배열인지 확인
      if (!Array.isArray(response)) {
        console.warn("투약 데이터가 배열이 아닙니다:", response);
        onMedicationsUpdate([]);
        return;
      }

      // 백엔드 응답을 프론트엔드 형식으로 변환
      const transformedMedications = response.map((med) => ({
        id: med.scheduleNo,
        name: med.medicationName || med.title,
        type: med.subType === "PILL" ? "복용약" : "영양제",
        frequency: med.frequency,
        duration: med.durationDays,
        startDate: med.startDate
          ? new Date(med.startDate).toISOString().split("T")[0]
          : "",
        endDate: med.endDate
          ? new Date(med.endDate).toISOString().split("T")[0]
          : "",
        scheduleTime: med.times ? med.times.join(", ") : med.time || "09:00",
        notificationTiming: med.reminderDaysBefore
          ? `${med.reminderDaysBefore}일 전`
          : "당일",
        petName: selectedPetName,
        petNo: selectedPetNo,
        icon: med.subType === "PILL" ? "💊" : "💊",
        color: med.subType === "PILL" ? "#E3F2FD" : "#FFF3E0",
        isNotified: med.alarmEnabled !== false,
        dosage: med.dosage,
        instructions: med.instructions,
        calNo: med.scheduleNo,
      }));

      onMedicationsUpdate(transformedMedications);
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
  }, [selectedPetNo, selectedPetName, onMedicationsUpdate]);

  // 컴포넌트 마운트 시 및 선택된 펫 변경 시 데이터 가져오기
  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

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
      0
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
        const current = new Date(startDate);

        // 시작일부터 종료일까지 반복하여 이벤트 생성
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
        const current = new Date(startDate);

        // 시작일부터 종료일까지 반복하여 이벤트 생성
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

      const newAlarmStatus = await toggleAlarm(medication.calNo);

      const updated = medications.map((med) =>
        med.id === id ? { ...med, isNotified: newAlarmStatus } : med
      );
      onMedicationsUpdate(updated);

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
        const result = await processPrescription(file, selectedPetNo);

        // 성공적인 응답인지 확인
        if (result && (result.medications || result.extractedMedications)) {
          setOcrResult(result);
          setShowResultModal(true);
        } else {
          // OCR 처리는 성공했지만 약물 정보가 없는 경우
          setErrorMessage("처방전에서 약물 정보를 찾을 수 없습니다.");
          setErrorDetails(
            "처방전 이미지가 불분명하거나 약물 정보가 명확하지 않습니다."
          );
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("처방전 OCR 처리 실패:", error);

        // 에러 메시지 설정
        let message = "처방전 처리에 실패했습니다.";
        let details = "";

        if (error.response) {
          // 서버 응답이 있는 경우
          const status = error.response.status;
          const data = error.response.data;

          switch (status) {
            case 400:
              message = "처방전 형식이 올바르지 않습니다.";
              details = data?.message || "이미지 파일을 확인해주세요.";
              break;
            case 413:
              message = "파일 크기가 너무 큽니다.";
              details = "파일 크기를 줄여서 다시 시도해주세요.";
              break;
            case 500:
              message = "서버에서 처방전을 처리하는데 실패했습니다.";
              details = data?.message || "잠시 후 다시 시도해주세요.";
              break;
            default:
              message = `처방전 처리 중 오류가 발생했습니다. (${status})`;
              details = data?.message || error.message;
          }
        } else if (error.request) {
          // 네트워크 에러
          message = "서버에 연결할 수 없습니다.";
          details = "인터넷 연결을 확인해주세요.";
        } else {
          // 기타 에러
          message = "처방전 업로드 중 오류가 발생했습니다.";
          details = error.message;
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

  // OCR 결과에서 약물들을 일괄 등록하는 함수
  const handleAddOcrMedications = async (ocrMedications) => {
    try {
      let successCount = 0;
      let failCount = 0;

      for (const medication of ocrMedications) {
        try {
          // 백엔드 형식으로 데이터 변환
          const medicationData = {
            petNo: selectedPetNo,
            name: medication.drugName || medication.name,
            amount: medication.dosage || "",
            instruction:
              medication.administration || medication.instructions || "",
            startDate: new Date().toISOString().split("T")[0], // 오늘 날짜
            durationDays: parseInt(medication.prescriptionDays) || 7,
            medicationFrequency: medication.frequency || "하루 1회",
            times: medication.times
              ? medication.times.map((t) => t.toString())
              : ["09:00"],
            reminderDaysBefore: 0, // 당일 알림
          };

          const calNo = await createMedication(medicationData);

          // 성공 시 로컬 상태 업데이트
          const updatedMedication = {
            ...medication,
            id: calNo,
            calNo: calNo,
            name: medication.drugName || medication.name,
            dosage: medication.dosage || "",
            instructions:
              medication.administration || medication.instructions || "",
            startDate: new Date().toISOString().split("T")[0],
            duration: parseInt(medication.prescriptionDays) || 7,
            frequency: medication.frequency || "하루 1회",
            scheduleTime: medication.times
              ? medication.times.map((t) => t.toString()).join(", ")
              : "09:00",
            notificationTiming: "당일",
            petName: selectedPetName,
            icon:
              medication.icon ||
              getMedicationIcon(medication.drugName || medication.name),
            color: medication.color || "#E3F2FD",
            isNotified: true,
          };

          onMedicationsUpdate((prev) => [...prev, updatedMedication]);
          successCount++;
        } catch (error) {
          console.error(
            "약물 등록 실패:",
            medication.drugName || medication.name,
            error
          );
          failCount++;
        }
      }

      // 결과 메시지
      if (successCount > 0) {
        setToastMessage(`${successCount}개의 투약 일정이 추가되었습니다.`);
        setToastType("active");
        setShowToast(true);
      }

      if (failCount > 0) {
        setToastMessage(`${failCount}개의 투약 일정 추가에 실패했습니다.`);
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      console.error("OCR 약물 일괄 등록 실패:", error);
      setToastMessage("투약 일정 등록 중 오류가 발생했습니다.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleAddNewMedication = async (newMedication) => {
    try {
      // 백엔드 형식으로 데이터 변환
      const medicationData = {
        petNo: selectedPetNo,
        name: newMedication.name,
        amount: newMedication.dosage || "",
        instruction: newMedication.instructions || "",
        startDate: newMedication.startDate,
        durationDays: newMedication.duration,
        medicationFrequency: newMedication.frequency,
        times: newMedication.scheduleTime
          ? newMedication.scheduleTime.split(",").map((t) => t.trim())
          : ["09:00"],
        reminderDaysBefore:
          newMedication.notificationTiming === "당일"
            ? 0
            : newMedication.notificationTiming === "1일 전"
            ? 1
            : newMedication.notificationTiming === "2일 전"
            ? 2
            : newMedication.notificationTiming === "3일 전"
            ? 3
            : 0,
      };

      const calNo = await createMedication(medicationData);

      // 성공 시 로컬 상태 업데이트
      const updatedMedication = {
        ...newMedication,
        id: calNo,
        calNo: calNo,
      };

      onMedicationsUpdate((prev) => [...prev, updatedMedication]);
      setToastMessage(`${newMedication.name}이(가) 추가되었습니다.`);
      setToastType("active");
      setShowToast(true);

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

      // 백엔드 형식으로 데이터 변환
      const updateData = {
        medicationName: updatedMedication.name,
        dosage: updatedMedication.dosage || "",
        administration: updatedMedication.instructions || "",
        frequency: updatedMedication.frequency,
        durationDays: updatedMedication.duration,
        startDate: updatedMedication.startDate,
        times: updatedMedication.scheduleTime
          ? updatedMedication.scheduleTime.split(",").map((t) => t.trim())
          : ["09:00"],
        subType: updatedMedication.type === "복용약" ? "PILL" : "SUPPLEMENT",
        reminderDaysBefore:
          updatedMedication.notificationTiming === "당일"
            ? 0
            : updatedMedication.notificationTiming === "1일 전"
            ? 1
            : updatedMedication.notificationTiming === "2일 전"
            ? 2
            : updatedMedication.notificationTiming === "3일 전"
            ? 3
            : 0,
      };

      await updateMedication(medication.calNo, updateData);

      // 성공 시 로컬 상태 업데이트
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
    } catch (error) {
      console.error("투약 수정 실패:", error);
      setToastMessage("투약 수정에 실패했습니다.");
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

  // 선택된 펫의 투약만 필터링 후 페이징
  const filteredMedications = medications.filter(
    (med) => !selectedPetName || med.petName === selectedPetName
  );
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
            paginatedMedications.map((medication) => (
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
        onAddMedications={handleAddOcrMedications}
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
