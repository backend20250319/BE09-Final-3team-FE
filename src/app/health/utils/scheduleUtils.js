// ========================================
// 일정 관련 유틸리티 함수들
// ========================================

import { formatDateToLocal } from "../constants/schedule";

// 일정 데이터 변환 (백엔드 → 프론트엔드)
export const transformScheduleData = (schedule, selectedPetName) => {
  // scheduleNo가 객체인 경우 숫자 값 추출
  let scheduleNo;
  if (typeof schedule.scheduleNo === "object" && schedule.scheduleNo !== null) {
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
    id = schedule.id.id || schedule.id.value || schedule.id.data || scheduleNo;
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
};

// 투약 데이터 변환 (백엔드 → 프론트엔드)
export const transformMedicationData = (
  med,
  selectedPetName,
  getMedicationIcon
) => {
  return {
    id: med.scheduleNo,
    calNo: med.scheduleNo,
    name: med.medicationName || med.title,
    type: med.subType,
    frequency: med.frequency,
    duration: med.durationDays,
    startDate: med.startDate || "",
    endDate: med.endDate || "",
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
    petNo: med.petNo,
    icon: getMedicationIcon(med.medicationName || med.title),
    color: med.subType === "복용약" ? "#E3F2FD" : "#FFF3E0",
    isNotified: med.alarmEnabled || false,
  };
};

// 일정 데이터를 최신순으로 정렬
export const sortSchedulesByLatest = (schedules) => {
  return schedules.sort((a, b) => {
    const idA = parseInt(a.id) || 0;
    const idB = parseInt(b.id) || 0;
    return idB - idA; // 내림차순 (최신이 위로)
  });
};

// 일정을 서브타입별로 분류
export const classifySchedulesBySubType = (
  schedules,
  isCareSubType,
  isVaccinationSubType
) => {
  const careSchedules = schedules.filter((schedule) =>
    isCareSubType(schedule.subType)
  );
  const vaccinationSchedules = schedules.filter((schedule) =>
    isVaccinationSubType(schedule.subType)
  );

  return {
    careSchedules: sortSchedulesByLatest(careSchedules),
    vaccinationSchedules: sortSchedulesByLatest(vaccinationSchedules),
  };
};

// 일정 데이터를 백엔드 형식으로 변환
export const transformToBackendFormat = (
  scheduleData,
  type,
  frequencyToEnum,
  typeToEnum
) => {
  if (type === "medication") {
    return {
      petNo: scheduleData.petNo,
      name: scheduleData.name,
      startDate: scheduleData.startDate,
      durationDays: scheduleData.duration,
      medicationFrequency:
        frequencyToEnum[scheduleData.frequency] || "DAILY_ONCE",
      times: scheduleData.scheduleTime
        ? scheduleData.scheduleTime.split(",").map((t) => {
            const time = t.trim();
            return time.includes(":") && time.split(":").length === 2
              ? `${time}:00`
              : time;
          })
        : ["09:00:00"],
      subType: typeToEnum[scheduleData.type] || "PILL",
      isPrescription: scheduleData.isPrescription || false,
      reminderDaysBefore: parseInt(scheduleData.notificationTiming, 10) || 0,
    };
  } else {
    // 돌봄/접종 일정
    return {
      petNo: scheduleData.petNo,
      title: scheduleData.name,
      subType: scheduleData.subType,
      careFrequency: scheduleData.frequency,
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate,
      times: scheduleData.scheduleTime
        ? scheduleData.scheduleTime
            .split(", ")
            .map((time) => time.trim() + ":00")
        : ["09:00:00"],
      reminderDaysBefore: parseInt(scheduleData.notificationTiming, 10) || 0,
    };
  }
};

// 일정 ID 추출 (캘린더 이벤트에서)
export const extractScheduleId = (selectedSchedule) => {
  let scheduleId = selectedSchedule.id;

  if (selectedSchedule.schedule && selectedSchedule.schedule.id) {
    scheduleId = selectedSchedule.schedule.id;
  } else if (
    typeof selectedSchedule.id === "string" &&
    selectedSchedule.id.startsWith("med-")
  ) {
    const parts = selectedSchedule.id.split("-");
    if (parts.length >= 2) {
      scheduleId = parseInt(parts[1], 10);
    }
  }

  return scheduleId;
};

// 일정 카테고리 확인
export const getScheduleCategory = (selectedSchedule) => {
  return (
    selectedSchedule.category ||
    selectedSchedule.type ||
    (selectedSchedule.schedule && selectedSchedule.schedule.category)
  );
};

// 일정 타입 확인
export const getScheduleType = (selectedSchedule) => {
  return (
    selectedSchedule.type ||
    (selectedSchedule.schedule && selectedSchedule.schedule.type)
  );
};
