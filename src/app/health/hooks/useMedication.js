"use client";

import { useState, useCallback } from "react";
import { useSelectedPet } from "../context/SelectedPetContext";
import {
  createMedication,
  listMedications,
  updateMedication,
  toggleAlarm,
  deleteMedication,
  createMedicationFromOcr,
} from "../../../api/medicationApi";
import { 
  frequencyMapping,
  getDefaultTimes,
  getMedicationIcon,
  MEDICATION_MESSAGES,
  COMMON_MESSAGES,
} from "../constants";

export function useMedication() {
  const { selectedPetName, selectedPetNo } = useSelectedPet();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 투약 데이터 가져오기
  const fetchMedications = useCallback(async (filter = "전체") => {
    if (!selectedPetNo) return;

    try {
      setIsLoading(true);
      setError(null);

      // 필터링 파라미터 구성
      const params = { petNo: selectedPetNo };

      if (filter !== "전체") {
        if (filter === "처방전") {
          params.isPrescription = true;
        } else {
          // 한글 타입을 Enum으로 변환
          const typeToEnum = {
            복용약: "PILL",
            영양제: "SUPPLEMENT",
          };
          params.type = typeToEnum[filter] || filter;
        }
      }

      console.log("투약 일정 필터링 파라미터:", params);
      const response = await listMedications(params);

      if (!Array.isArray(response)) {
        console.warn("투약 데이터가 배열이 아닙니다:", response);
        setMedications([]);
        return;
      }

      // 백엔드 응답을 프론트엔드 형식으로 변환
      const transformedMedications = response.map((med) => {
        return {
          id: med.scheduleNo,
          calNo: med.scheduleNo,
          name: med.medicationName || med.title,
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
          icon: getMedicationIcon(med.medicationName || med.title),
          color: med.subType === "복용약" ? "#E3F2FD" : "#FFF3E0",
          isNotified: med.alarmEnabled || false,
        };
      });

      // 최신순으로 정렬
      const sortedMedications = transformedMedications.sort((a, b) => {
        const idA = parseInt(a.id) || 0;
        const idB = parseInt(b.id) || 0;
        return idB - idA;
      });

      setMedications(sortedMedications);
    } catch (error) {
      console.error("투약 데이터 가져오기 실패:", error);
      setError(error.response?.status !== 404 ? MEDICATION_MESSAGES.LOAD_ERROR : null);
      if (error.response?.status !== 404) {
        setMedications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedPetNo, selectedPetName]);

  // 투약 추가
  const addMedication = useCallback(async (medicationData) => {
    try {
      // 백엔드 형식으로 데이터 변환
      const frequencyToEnum = {
        "하루에 한 번": "DAILY_ONCE",
        "하루에 두 번": "DAILY_TWICE",
        "하루에 세 번": "DAILY_THREE_TIMES",
        "주에 한 번": "WEEKLY_ONCE",
        "월에 한 번": "MONTHLY_ONCE",
      };

      const typeToEnum = {
        복용약: "PILL",
        영양제: "SUPPLEMENT",
      };

      const data = {
        petNo: selectedPetNo,
        name: medicationData.name,
        startDate: medicationData.startDate,
        durationDays: medicationData.duration,
        medicationFrequency: frequencyToEnum[medicationData.frequency] || "DAILY_ONCE",
        times: medicationData.scheduleTime
          ? medicationData.scheduleTime.split(",").map((t) => {
              const time = t.trim();
              return time.includes(":") && time.split(":").length === 2
                ? `${time}:00`
                : time;
            })
          : ["09:00:00"],
        subType: medicationData.type === "영양제" ? "SUPPLEMENT" : "PILL",
        isPrescription: medicationData.isPrescription || false,
        reminderDaysBefore: parseInt(medicationData.notificationTiming, 10) || 0,
      };

      const calNo = await createMedication(data);

      // 성공 시 로컬 상태 업데이트
      const updatedMedication = {
        ...medicationData,
        id: calNo,
        calNo: calNo,
        frequency: frequencyMapping[medicationData.frequency] || medicationData.frequency,
      };

      setMedications((prev) => {
        const updated = [...prev, updatedMedication];
        return updated.sort((a, b) => {
          const idA = parseInt(a.id) || 0;
          const idB = parseInt(b.id) || 0;
          return idB - idA;
        });
      });

      return { success: true, data: updatedMedication };
    } catch (error) {
      console.error("투약 추가 실패:", error);
      setError(MEDICATION_MESSAGES.ADD_ERROR);
      return { success: false, error: error.message };
    }
  }, [selectedPetNo]);

  // 투약 수정
  const updateMedicationData = useCallback(async (id, medicationData) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (!medication || !medication.calNo) {
        throw new Error("투약 정보를 찾을 수 없습니다.");
      }

      const frequencyToEnum = {
        "하루에 한 번": "DAILY_ONCE",
        "하루에 두 번": "DAILY_TWICE",
        "하루에 세 번": "DAILY_THREE_TIMES",
        "주에 한 번": "WEEKLY_ONCE",
        "월에 한 번": "MONTHLY_ONCE",
      };

      const typeToEnum = {
        복용약: "PILL",
        영양제: "SUPPLEMENT",
      };

      const updateData = {
        name: medicationData.name,
        startDate: medicationData.startDate,
        durationDays: medicationData.duration,
        medicationFrequency: frequencyToEnum[medicationData.frequency] || "DAILY_ONCE",
        times: medicationData.scheduleTime
          ? medicationData.scheduleTime.split(",").map((t) => {
              const time = t.trim();
              return time.includes(":") && time.split(":").length === 2
                ? `${time}:00`
                : time;
            })
          : ["09:00:00"],
        subType: medicationData.type === "영양제" ? "SUPPLEMENT" : "PILL",
        isPrescription: medicationData.isPrescription || false,
        reminderDaysBefore: medicationData.reminderDaysBefore,
      };

      await updateMedication(medication.calNo, updateData);

      // 로컬 상태 업데이트
      setMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, ...medicationData } : med))
      );

      return { success: true };
    } catch (error) {
      console.error("투약 수정 실패:", error);
      setError(MEDICATION_MESSAGES.EDIT_ERROR);
      return { success: false, error: error.message };
    }
  }, [medications]);

  // 투약 삭제
  const removeMedication = useCallback(async (id) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (!medication || !medication.calNo) {
        throw new Error("투약 정보를 찾을 수 없습니다.");
      }

      await deleteMedication(medication.calNo);

      // 로컬 상태에서 제거
      setMedications((prev) => prev.filter((med) => med.id !== id));

      return { success: true };
    } catch (error) {
      console.error("투약 삭제 실패:", error);
      setError(MEDICATION_MESSAGES.DELETE_ERROR);
      return { success: false, error: error.message };
    }
  }, [medications]);

  // 알림 토글
  const toggleNotification = useCallback(async (id) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (!medication || !medication.calNo) {
        throw new Error("투약 정보를 찾을 수 없습니다.");
      }

      let calNo = medication.calNo;
      if (typeof calNo === "object" && calNo !== null) {
        calNo = calNo.scheduleNo || calNo.id || calNo.value || calNo.data;
      }

      const newAlarmStatus = await toggleAlarm(calNo);

      // 로컬 상태 업데이트
      setMedications((prev) =>
        prev.map((med) =>
          med.id === id ? { ...med, isNotified: newAlarmStatus } : med
        )
      );

      return { success: true, isNotified: newAlarmStatus };
    } catch (error) {
      console.error("알림 토글 실패:", error);
      setError(MEDICATION_MESSAGES.NOTIFICATION_TOGGLE_ERROR);
      return { success: false, error: error.message };
    }
  }, [medications]);

  // OCR 처방전 처리
  const processPrescription = useCallback(async (file) => {
    if (!selectedPetNo) {
      return { success: false, error: COMMON_MESSAGES.SELECT_PET };
    }

    try {
      setIsLoading(true);
      const result = await createMedicationFromOcr(file, selectedPetNo);

      if (result && result.code === "2000" && result.createdSchedules > 0) {
        // 성공적으로 일정이 등록된 경우
        await fetchMedications();
        return {
          success: true,
          data: {
            createdSchedules: result.createdSchedules,
            scheduleNo: result.scheduleNo,
            message: result.message,
            data: result.data,
          },
        };
      } else if (result && result.code === "9000") {
        return {
          success: false,
          error: MEDICATION_MESSAGES.OCR_SERVER_ERROR,
          details: result.message,
        };
      } else {
        return {
          success: false,
          error: MEDICATION_MESSAGES.OCR_NO_MEDICATION,
        };
      }
    } catch (error) {
      console.error("처방전 OCR 처리 실패:", error);
      return {
        success: false,
        error: MEDICATION_MESSAGES.OCR_ERROR,
        details: error.message,
      };
    } finally {
      setIsLoading(false);
    }
  }, [selectedPetNo, fetchMedications]);

  return {
    medications,
    isLoading,
    error,
    fetchMedications,
    addMedication,
    updateMedication: updateMedicationData,
    deleteMedication: removeMedication,
    toggleNotification,
    processPrescription,
  };
}
