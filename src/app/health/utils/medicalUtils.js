// ========================================
// 의료 관련 유틸리티 함수들
// ========================================

import { formatDateToLocal } from "../constants/schedule";

// 서브타입 기반 분류 함수들
export const isCareSubType = (subType) => {
  return ["WALK", "BIRTHDAY", "GROOMING", "ETC"].includes(subType);
};

export const isVaccinationSubType = (subType) => {
  return ["VACCINE", "CHECKUP"].includes(subType);
};

// 일정을 빈도별로 확장하여 표시하는 함수
export const expandSchedulesByFrequency = (schedules) => {
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

  return expandedSchedules;
};

// 캘린더 이벤트 구성 함수
export const buildCalendarEvents = (
  medications,
  careSchedules,
  vaccinationSchedules,
  selectedPetName,
  dateAtTime,
  getScheduleIcon,
  getScheduleLabel,
  careFrequencyMapping,
  vaccinationFrequencyMapping
) => {
  const events = [];

  // 1) 투약: 기간 동안 매일, scheduleTime(콤마 구분) 각각 이벤트 생성
  medications
    .filter((med) => !selectedPetName || med.petName === selectedPetName)
    .forEach((med) => {
      if (med.startDate && med.endDate) {
        const start = new Date(med.startDate);
        const end = new Date(med.endDate);
        const times = (med.scheduleTime || "09:00").split(",").map((t) => {
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

  // 2) 돌봄 일정
  careSchedules
    .filter((s) => !selectedPetName || s.petName === selectedPetName)
    .forEach((s) => {
      if (s.startDate && s.endDate) {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const frequency = s.frequency || s.careFrequency;
        const koreanFrequency = careFrequencyMapping[frequency] || frequency;

        const getFirstTime = () => {
          if (s.times && s.times.length > 0) {
            return s.times[0];
          } else if (s.scheduleTime) {
            const times = s.scheduleTime.split(",").map((t) => t.trim());
            return times[0] || "09:00";
          }
          return "09:00";
        };

        if (koreanFrequency === "당일") {
          const firstTime = getFirstTime();
          const sTime = dateAtTime(start, firstTime);
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          events.push({
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
            },
          });
        } else if (koreanFrequency === "매일") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setDate(current.getDate() + 1);
          }
        } else if (koreanFrequency === "매주") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setDate(current.getDate() + 7);
          }
        } else if (koreanFrequency === "매월") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setMonth(current.getMonth() + 1);
          }
        }
      }
    });

  // 3) 접종 일정
  vaccinationSchedules
    .filter((s) => !selectedPetName || s.petName === selectedPetName)
    .forEach((s) => {
      if (s.startDate && s.endDate) {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const frequency = s.frequency || s.careFrequency;
        const koreanFrequency = vaccinationFrequencyMapping[frequency] || frequency;

        const getFirstTime = () => {
          if (s.times && s.times.length > 0) {
            return s.times[0];
          } else if (s.scheduleTime) {
            const times = s.scheduleTime.split(",").map((t) => t.trim());
            return times[0] || "10:00";
          }
          return "10:00";
        };

        if (koreanFrequency === "당일") {
          const firstTime = getFirstTime();
          const sTime = dateAtTime(start, firstTime);
          const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
          events.push({
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
            },
          });
        } else if (koreanFrequency === "매일") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setDate(current.getDate() + 1);
          }
        } else if (koreanFrequency === "매주") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setDate(current.getDate() + 7);
          }
        } else if (koreanFrequency === "매월") {
          const current = new Date(start);
          while (current <= end) {
            const firstTime = getFirstTime();
            const sTime = dateAtTime(current, firstTime);
            const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
            events.push({
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
              },
            });
            current.setMonth(current.getMonth() + 1);
          }
        }
      }
    });

  return events;
};

// 특정 날짜와 "HH:MM" 문자열로 Date 만들기
export const createDateAtTime = (baseDate, hm) => {
  const [hh = 9, mm = 0] = (hm || "09:00")
    .split(":")
    .map((n) => parseInt(n.trim(), 10));
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hh,
    mm,
    0,
    0
  );
};

// 일정 개수 계산
export const calculateScheduleCount = (startDate, endDate, frequency) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let scheduleCount = 1;

  if (frequency === "매일") {
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    scheduleCount = daysDiff;
  } else if (frequency === "매주") {
    const timeDiff = end.getTime() - start.getTime();
    const weeksDiff = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7)) + 1;
    scheduleCount = weeksDiff;
  } else if (frequency === "매월") {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    scheduleCount = yearDiff * 12 + monthDiff + 1;
  }

  return scheduleCount;
};
