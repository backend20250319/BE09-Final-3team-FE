"use client";

import { useState, useCallback } from "react";
import { useSelectedPet } from "../context/SelectedPetContext";
import {
  createCare,
  listCareSchedules,
  updateCareSchedule,
  deleteCareSchedule,
  toggleCareAlarm,
} from "../../../api/medicationApi";
import {
  careFrequencyMapping,
  vaccinationFrequencyMapping,
  CARE_MESSAGES,
  VACCINATION_MESSAGES,
  COMMON_MESSAGES,
} from "../constants";

export function useCare() {
  const { selectedPetName, selectedPetNo } = useSelectedPet();
  const [careSchedules, setCareSchedules] = useState([]);
  const [vaccinationSchedules, setVaccinationSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 서브타입 기반 분류 함수들
  const isCareSubType = (subType) => {
    return ["WALK", "BIRTHDAY", "GROOMING", "ETC"].includes(subType);
  };

  const isVaccinationSubType = (subType) => {
    return ["VACCINE", "CHECKUP"].includes(subType);
  };

  // 돌봄/접종 일정 데이터 가져오기
  const fetchCareSchedules = useCallback(async () => {
    if (!selectedPetNo) return;

    try {
      setIsLoading(true);
      setError(null);

      const schedules = await listCareSchedules({ petNo: selectedPetNo });

      if (schedules && Array.isArray(schedules)) {
        // 백엔드 응답을 프론트엔드 형식으로 변환
        const transformedSchedules = schedules.map((schedule) => {
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
            calNo: scheduleNo,
            name: schedule.title,
            title: schedule.title,
            subType: schedule.subType,
            frequency: schedule.frequency,
            careFrequency: schedule.frequency,
            startDate: schedule.startDate,
            endDate: schedule.endDate,
            scheduleTime: schedule.times
              ? schedule.times
                  .map((time) => {
                    if (time && time.includes(":")) {
                      const parts = time.split(":");
                      if (parts.length >= 2) {
                        return `${parts[0]}:${parts[1]}`;
                      }
                    }
                    return time;
                  })
                  .join(", ")
              : "09:00",
            reminderDaysBefore: schedule.reminderDaysBefore,
            lastReminderDaysBefore: schedule.lastReminderDaysBefore,
            isNotified:
              schedule.alarmEnabled !== undefined
                ? schedule.alarmEnabled
                : schedule.reminderDaysBefore !== null,
            petName: selectedPetName,
            color: schedule.color || "#4CAF50",
            date: schedule.startDate,
          };
        });

        // 서브타입에 따라 돌봄과 접종으로 분류
        const careSchedulesData = transformedSchedules.filter((schedule) =>
          isCareSubType(schedule.subType)
        );
        const vaccinationSchedulesData = transformedSchedules.filter(
          (schedule) => isVaccinationSubType(schedule.subType)
        );

        // 최신순으로 정렬 (ID 기준)
        const sortedCareSchedules = careSchedulesData.sort((a, b) => {
          const idA = parseInt(a.id) || 0;
          const idB = parseInt(b.id) || 0;
          return idB - idA; // 최신 등록된 일정이 위에 오도록
        });

        const sortedVaccinationSchedules = vaccinationSchedulesData.sort(
          (a, b) => {
            const idA = parseInt(a.id) || 0;
            const idB = parseInt(b.id) || 0;
            return idB - idA; // 최신 등록된 일정이 위에 오도록
          }
        );

        setCareSchedules(sortedCareSchedules);
        setVaccinationSchedules(sortedVaccinationSchedules);
      } else {
        setCareSchedules([]);
        setVaccinationSchedules([]);
      }
    } catch (error) {
      console.error("돌봄/접종 일정 조회 실패:", error);
      setError("일정 조회에 실패했습니다.");
      setCareSchedules([]);
      setVaccinationSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPetNo, selectedPetName]);

  // 일정 추가
  const addSchedule = useCallback(
    async (scheduleData) => {
      try {
        if (!selectedPetNo) {
          throw new Error(COMMON_MESSAGES.SELECT_PET);
        }

        const careData = {
          petNo: selectedPetNo,
          title: scheduleData.name,
          subType: scheduleData.subType,
          careFrequency: isVaccinationSubType(scheduleData.subType)
            ? vaccinationFrequencyMapping[scheduleData.frequency]
            : careFrequencyMapping[scheduleData.frequency],
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
          times: scheduleData.scheduleTime
            ? scheduleData.scheduleTime
                .split(", ")
                .map((time) => time.trim() + ":00")
            : ["09:00:00"],
          reminderDaysBefore:
            parseInt(scheduleData.notificationTiming, 10) || 0,
        };

        const calNo = await createCare(careData);

        const updatedSchedule = {
          ...scheduleData,
          id: calNo,
          reminderDaysBefore:
            parseInt(scheduleData.notificationTiming, 10) || 0,
          lastReminderDaysBefore:
            parseInt(scheduleData.notificationTiming, 10) || 0,
          isNotified: true,
        };

        // 서브타입에 따라 분류하여 상태 업데이트
        if (isVaccinationSubType(scheduleData.subType)) {
          setVaccinationSchedules((prev) => [...prev, updatedSchedule]);
        } else if (isCareSubType(scheduleData.subType)) {
          setCareSchedules((prev) => [...prev, updatedSchedule]);
        }

        return { success: true, data: updatedSchedule };
      } catch (error) {
        console.error("일정 생성 실패:", error);
        setError(error.message || "일정 생성에 실패했습니다.");
        return { success: false, error: error.message };
      }
    },
    [selectedPetNo]
  );

  // 일정 수정
  const updateSchedule = useCallback(
    async (id, scheduleData) => {
      try {
        if (!selectedPetNo) {
          throw new Error(COMMON_MESSAGES.SELECT_PET);
        }

        const updateData = {
          title: scheduleData.name,
          subType: scheduleData.subType,
          careFrequency: isVaccinationSubType(scheduleData.subType)
            ? vaccinationFrequencyMapping[scheduleData.frequency]
            : careFrequencyMapping[scheduleData.frequency],
          startDate: scheduleData.startDate,
          endDate: scheduleData.endDate,
          times: scheduleData.scheduleTime
            ? scheduleData.scheduleTime
                .split(", ")
                .map((time) => time.trim() + ":00")
            : ["09:00:00"],
          reminderDaysBefore:
            parseInt(scheduleData.reminderDaysBefore, 10) || 0,
        };

        await updateCareSchedule(id, updateData);

        // 서브타입에 따라 분류하여 상태 업데이트
        if (isVaccinationSubType(scheduleData.subType)) {
          setVaccinationSchedules((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...scheduleData } : s))
          );
        } else if (isCareSubType(scheduleData.subType)) {
          setCareSchedules((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...scheduleData } : s))
          );
        }

        return { success: true };
      } catch (error) {
        console.error("일정 수정 실패:", error);
        setError(error.message || "일정 수정에 실패했습니다.");
        return { success: false, error: error.message };
      }
    },
    [selectedPetNo]
  );

  // 일정 삭제
  const removeSchedule = useCallback(
    async (id) => {
      try {
        await deleteCareSchedule(id);

        // 서브타입에 따라 분류하여 상태에서 제거
        const careSchedule = careSchedules.find(
          (schedule) => schedule.id === id
        );
        const vaccinationSchedule = vaccinationSchedules.find(
          (schedule) => schedule.id === id
        );

        if (careSchedule) {
          setCareSchedules((prev) =>
            prev.filter((schedule) => schedule.id !== id)
          );
        } else if (vaccinationSchedule) {
          setVaccinationSchedules((prev) =>
            prev.filter((schedule) => schedule.id !== id)
          );
        }

        return { success: true };
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        setError(error.message || "일정 삭제에 실패했습니다.");
        return { success: false, error: error.message };
      }
    },
    [careSchedules, vaccinationSchedules]
  );

  // 알림 토글
  const toggleNotification = useCallback(
    async (id) => {
      try {
        const result = await toggleCareAlarm(id);

        // 서브타입에 따라 분류하여 상태 업데이트
        const careSchedule = careSchedules.find(
          (schedule) => schedule.id === id
        );
        const vaccinationSchedule = vaccinationSchedules.find(
          (schedule) => schedule.id === id
        );

        if (careSchedule) {
          setCareSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === id
                ? { ...schedule, isNotified: result }
                : schedule
            )
          );
        } else if (vaccinationSchedule) {
          setVaccinationSchedules((prev) =>
            prev.map((schedule) =>
              schedule.id === id
                ? { ...schedule, isNotified: result }
                : schedule
            )
          );
        }

        return { success: true, isNotified: result };
      } catch (error) {
        console.error("알림 토글 실패:", error);
        setError(error.message || "알림 설정 변경에 실패했습니다.");
        return { success: false, error: error.message };
      }
    },
    [careSchedules, vaccinationSchedules]
  );

  return {
    careSchedules,
    vaccinationSchedules,
    isLoading,
    error,
    fetchCareSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule: removeSchedule,
    toggleNotification,
    isCareSubType,
    isVaccinationSubType,
  };
}
