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
  const fetchMedications = useCallback(
    async (filter = "전체") => {
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

        const response = await listMedications(params);

        if (!Array.isArray(response)) {
          console.warn("투약 데이터가 배열이 아닙니다:", response);
          setMedications([]);
          return;
        }

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const transformedMedications = response.map((med) => {
          // 백엔드에서 이미 한글 빈도를 보내주므로 그대로 사용
          let frequency = med.frequency;
          console.log(
            "🔍 훅 - 원본 빈도:",
            med.frequency,
            "타입:",
            typeof med.frequency
          );
          console.log("🔍 훅 - 최종 빈도 (변환 없이 사용):", frequency);

          // OCR 처방전인 경우 durationDays 사용, 기본 투약일정인 경우 endDate 사용
          const isPrescription = med.isPrescription || false;
          let duration, endDate;

          if (isPrescription) {
            // OCR 처방전: durationDays 사용
            duration = med.durationDays;
            endDate = med.endDate || "";
          } else {
            // 기본 투약일정: endDate 사용, duration은 계산
            endDate = med.endDate || "";
            if (med.startDate && med.endDate) {
              const start = new Date(med.startDate);
              const end = new Date(med.endDate);
              duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            } else {
              duration = med.durationDays || 0;
            }
          }

          const transformedMed = {
            id: med.scheduleNo,
            calNo: med.scheduleNo,
            name: med.medicationName || med.title,
            type: med.subType,
            frequency: frequency,
            duration: duration,
            startDate: med.startDate || "",
            endDate: endDate,
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

          // 처방전 OCR 투약일정 디버깅
          if (isPrescription) {
            console.log("🔍 처방전 OCR 투약일정 변환:", {
              scheduleNo: med.scheduleNo,
              calNo: transformedMed.calNo,
              isPrescription: transformedMed.isPrescription,
              isNotified: transformedMed.isNotified,
              alarmEnabled: med.alarmEnabled,
            });
          }

          return transformedMed;
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
        setError(
          error.response?.status !== 404 ? MEDICATION_MESSAGES.LOAD_ERROR : null
        );
        if (error.response?.status !== 404) {
          setMedications([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPetNo, selectedPetName]
  );

  // 투약 추가
  const addMedication = useCallback(
    async (medicationData) => {
      try {
        console.log("🔍 훅 - 투약 추가 데이터:", medicationData);
        console.log(
          "🔍 훅 - 선택된 빈도:",
          medicationData.frequency,
          "타입:",
          typeof medicationData.frequency
        );

        const frequencyToEnum = {
          "하루에 한 번": "DAILY_ONCE",
          "하루에 두 번": "DAILY_TWICE",
          "하루에 세 번": "DAILY_THREE",
        };

        // 백엔드 형식으로 데이터 변환
        const typeToEnum = {
          복용약: "PILL",
          영양제: "SUPPLEMENT",
        };

        const data = {
          petNo: selectedPetNo,
          name: medicationData.name, // 백엔드 API 필드명에 맞춤
          startDate: medicationData.startDate,
          endDate: medicationData.endDate, // durationDays 대신 endDate 사용
          medicationFrequency:
            medicationData.medicationFrequency ||
            frequencyToEnum[medicationData.frequency] ||
            "DAILY_ONCE", // 백엔드 API 필드명에 맞춤
          times:
            medicationData.times ||
            (medicationData.scheduleTime
              ? medicationData.scheduleTime.split(",").map((t) => {
                  const time = t.trim();
                  return time.includes(":") && time.split(":").length === 2
                    ? time // "09:00" 형태로 유지 (백엔드에서 초 단위 처리)
                    : time;
                })
              : ["09:00"]),
          subType:
            medicationData.type === "영양제" ||
            medicationData.type === "SUPPLEMENT"
              ? "SUPPLEMENT"
              : "PILL", // 한글/영어 모두 처리
          isPrescription: medicationData.isPrescription || false,
          reminderDaysBefore:
            medicationData.reminderDaysBefore ||
            parseInt(medicationData.notificationTiming, 10) ||
            0,
        };

        console.log("🔍 훅 - 전송할 데이터:", data);

        // 백엔드 API 호출
        const calNo = await createMedication(data);
        console.log("🔍 훅 - 투약 등록 성공, calNo:", calNo);

        // API 호출 성공 후 데이터 새로고침
        await fetchMedications();

        return {
          success: true,
          data: { calNo: calNo },
        };
      } catch (error) {
        console.error("투약 추가 실패:", error);

        setError(MEDICATION_MESSAGES.ADD_ERROR);
        return { success: false, error: error.message };
      }
    },
    [selectedPetNo, fetchMedications]
  );

  // 투약 수정
  const updateMedicationData = useCallback(
    async (id, medicationData) => {
      try {
        const medication = medications.find((med) => med.id === id);
        if (!medication || !medication.calNo) {
          throw new Error("투약 정보를 찾을 수 없습니다.");
        }

        const frequencyToEnum = {
          "하루에 한 번": "DAILY_ONCE",
          "하루에 두 번": "DAILY_TWICE",
          "하루에 세 번": "DAILY_THREE",
        };

        const typeToEnum = {
          복용약: "PILL",
          영양제: "SUPPLEMENT",
        };

        // 처방전 OCR 투약일정과 기본 투약일정 구분하여 데이터 구성
        const isPrescription = medication.isPrescription || false;
        let updateData;

        if (isPrescription) {
          // 처방전 OCR 투약일정: durationDays 사용 (자동 계산)
          updateData = {
            medicationName: medicationData.name, // 백엔드 API 필드명에 맞춤
            durationDays: medicationData.duration, // 처방전은 durationDays 사용
            startDate: medicationData.startDate,
            frequency: medicationData.frequency, // 백엔드 API 필드명에 맞춤 (한글 그대로)
            times: medicationData.scheduleTime
              ? medicationData.scheduleTime.split(",").map((t) => {
                  const time = t.trim();
                  return time.includes(":") && time.split(":").length === 2
                    ? time // "09:00" 형태로 유지 (백엔드에서 초 단위 처리)
                    : time;
                })
              : ["09:00"],
            subType:
              medicationData.type === "영양제" ||
              medicationData.type === "SUPPLEMENT"
                ? "SUPPLEMENT"
                : "PILL",
            isPrescription: true,
            reminderDaysBefore: 0, // 처방전은 0일전 고정
            dosage: medicationData.dosage || "500mg", // 처방전 투약일정의 경우 용량 필드 추가
          };
          console.log("🔍 처방전 OCR 수정 - 자동 계산 데이터:", updateData);
        } else {
          // 기본 투약일정: endDate 사용
          updateData = {
            medicationName: medicationData.name, // 백엔드 API 필드명에 맞춤
            startDate: medicationData.startDate,
            endDate: medicationData.endDate, // 기본 투약일정은 endDate 사용
            frequency: medicationData.frequency, // 백엔드 API 필드명에 맞춤 (한글 그대로)
            times: medicationData.scheduleTime
              ? medicationData.scheduleTime.split(",").map((t) => {
                  const time = t.trim();
                  return time.includes(":") && time.split(":").length === 2
                    ? time // "09:00" 형태로 유지 (백엔드에서 초 단위 처리)
                    : time;
                })
              : ["09:00"],
            subType:
              medicationData.type === "영양제" ||
              medicationData.type === "SUPPLEMENT"
                ? "SUPPLEMENT"
                : "PILL",
            isPrescription: false,
            reminderDaysBefore: medicationData.reminderDaysBefore,
          };
          console.log("🔍 기본 투약일정 수정 데이터:", updateData);
        }

        await updateMedication(medication.calNo, updateData);

        // API 호출 성공 후 데이터 새로고침
        await fetchMedications();

        return { success: true };
      } catch (error) {
        console.error("투약 수정 실패:", error);
        setError(MEDICATION_MESSAGES.EDIT_ERROR);
        return { success: false, error: error.message };
      }
    },
    [medications, fetchMedications]
  );

  // 투약 삭제
  const removeMedication = useCallback(
    async (id) => {
      try {
        const medication = medications.find((med) => med.id === id);
        if (!medication || !medication.calNo) {
          throw new Error("투약 정보를 찾을 수 없습니다.");
        }

        await deleteMedication(medication.calNo);

        // API 호출 성공 후 데이터 새로고침
        await fetchMedications();

        return { success: true };
      } catch (error) {
        console.error("투약 삭제 실패:", error);
        setError(MEDICATION_MESSAGES.DELETE_ERROR);
        return { success: false, error: error.message };
      }
    },
    [medications, fetchMedications]
  );

  // 알림 토글
  const toggleNotification = useCallback(
    async (id) => {
      try {
        const medication = medications.find((med) => med.id === id);
        console.log("🔍 알림 토글 - 찾은 투약일정:", medication);
        console.log(
          "🔍 알림 토글 - isPrescription:",
          medication?.isPrescription
        );
        console.log("🔍 알림 토글 - calNo:", medication?.calNo);

        if (!medication || !medication.calNo) {
          throw new Error("투약 정보를 찾을 수 없습니다.");
        }

        let calNo = medication.calNo;
        if (typeof calNo === "object" && calNo !== null) {
          calNo = calNo.scheduleNo || calNo.id || calNo.value || calNo.data;
        }

        console.log("🔍 알림 토글 - 최종 calNo:", calNo);
        console.log("🔍 알림 토글 - calNo 타입:", typeof calNo);

        const newAlarmStatus = await toggleAlarm(calNo);
        console.log("🔍 알림 토글 - API 응답:", newAlarmStatus);

        // API 호출 성공 후 데이터 새로고침
        await fetchMedications();

        return { success: true, isNotified: newAlarmStatus };
      } catch (error) {
        console.error("알림 토글 실패:", error);
        setError(MEDICATION_MESSAGES.NOTIFICATION_TOGGLE_ERROR);
        return { success: false, error: error.message };
      }
    },
    [medications, fetchMedications]
  );

  // OCR 처방전 처리
  const processPrescription = useCallback(
    async (file) => {
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
    },
    [selectedPetNo, fetchMedications]
  );

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
