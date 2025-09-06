"use client";

import { useState, useCallback } from "react";
import { 
  getDefaultTimes,
  getTimeInputCount,
  VALIDATION_MESSAGES,
  FREQUENCY_HINTS,
} from "../constants";

export function useMedicalForm(type) {
  const [formData, setFormData] = useState({
    name: "",
    subType: "",
    frequency: "",
    date: "",
    startDate: "",
    endDate: "",
    time: "",
    scheduleTime: "",
    duration: "",
    notificationTiming: "",
    lastReminderDaysBefore: null,
  });

  const [errors, setErrors] = useState({});
  const [isPrescription, setIsPrescription] = useState(false);

  // 종료날짜 검증 함수
  const validateEndDate = useCallback((startDate, endDate, frequency) => {
    if (!endDate) return { valid: true };

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return {
        valid: false,
        message: VALIDATION_MESSAGES.END_DATE_BEFORE_START,
      };
    }

    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    switch (frequency) {
      case "매일":
        return { valid: true };
      case "당일":
        return { valid: true };
      case "매주":
        if (daysDiff < 7) {
          const minDate = new Date(start);
          minDate.setDate(minDate.getDate() + 7);
          return {
            valid: false,
            message: `매주 일정의 종료일은 시작일로부터 최소 7일 이후여야 합니다. 최소 종료일: ${
              minDate.toISOString().split("T")[0]
            }`,
          };
        }
        break;
      case "매월":
        if (daysDiff < 30) {
          const minDate = new Date(start);
          minDate.setDate(minDate.getDate() + 30);
          return {
            valid: false,
            message: `매월 일정의 종료일은 시작일로부터 최소 30일 이후여야 합니다. 최소 종료일: ${
              minDate.toISOString().split("T")[0]
            }`,
          };
        }
        break;
    }

    return { valid: true };
  }, []);

  // 최소 종료날짜 계산 함수
  const getMinEndDate = useCallback((startDate, frequency) => {
    if (!startDate) return null;

    const start = new Date(startDate);

    switch (frequency) {
      case "매일":
        return start;
      case "매주":
        const weekly = new Date(start);
        weekly.setDate(weekly.getDate() + 7);
        return weekly;
      case "매월":
        const monthly = new Date(start);
        monthly.setDate(monthly.getDate() + 30);
        return monthly;
      default:
        return start;
    }
  }, []);

  // 빈도별 힌트 메시지
  const getEndDateHint = useCallback((frequency) => {
    if (
      (type === "care" || type === "vaccination") &&
      ["매일", "매주", "매월", "당일"].includes(frequency)
    ) {
      return FREQUENCY_HINTS.FIXED_END_DATE;
    }

    switch (frequency) {
      case "매일":
        return FREQUENCY_HINTS.DAILY;
      case "매주":
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          const dayOfWeek = startDate.getDay();
          const weekdays = [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
          ];
          return `선택해주신 ${weekdays[dayOfWeek]} 기준으로 매주 반복됩니다. 종료날짜는 ${weekdays[dayOfWeek]}만 선택할 수 있습니다.`;
        }
        return "종료일을 입력하지 않으면 1주일 후로 설정됩니다. (최소 7일 이후)";
      case "매월":
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          const day = startDate.getDate();
          return `선택해주신 ${day}일 기준으로 매월 반복됩니다. 종료날짜는 ${day}일만 선택할 수 있습니다.`;
        }
        return "종료일을 입력하지 않으면 1개월 후로 설정됩니다. (최소 30일 이후)";
      default:
        return "종료날짜가 선택사항으로 되어있는데 선택을 안하면 자동 계산되어 종료일자가 설정됩니다.";
    }
  }, [type, formData.startDate]);

  // 폼 데이터 업데이트
  const updateFormData = useCallback((field, value) => {
    // 처방전인 경우 알림 시기 변경 제한
    if (field === "notificationTiming" && isPrescription) {
      return;
    }

    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // 복용 빈도가 변경되면 기본 시간도 함께 설정
      if (field === "frequency") {
        const defaultTimes = getDefaultTimes(value);
        newData.scheduleTime = defaultTimes.join(", ");

        // 돌봄과 접종의 경우 빈도에 따른 종료날짜 처리
        if (type === "care" || type === "vaccination") {
          if (["매일", "매주", "매월", "당일"].includes(value)) {
            if (prev.startDate) {
              newData.endDate = prev.startDate;
            }
          }
        }
      }

      // 시작날짜가 변경되면 종료날짜 처리
      if (field === "startDate") {
        if (type === "care" || type === "vaccination") {
          if (["매일", "매주", "매월", "당일"].includes(prev.frequency)) {
            newData.endDate = value;
          }
        }
      }

      // 투약의 경우 복용 기간이나 시작날짜가 변경되면 종료날짜 검증
      if (
        type === "medication" &&
        (field === "duration" || field === "startDate") &&
        newData.startDate &&
        newData.duration
      ) {
        const startDateObj = new Date(newData.startDate);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(
          startDateObj.getDate() + Number(newData.duration) - 1
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        endDateObj.setHours(0, 0, 0, 0);

        if (endDateObj < today) {
          setErrors((prev) => ({
            ...prev,
            duration: VALIDATION_MESSAGES.DURATION_INVALID,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            duration: "",
          }));
        }
      }

      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }, [type, isPrescription, errors]);

  // 폼 검증
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = `${type === "medication" ? "약 이름" : "일정 이름"}${VALIDATION_MESSAGES.REQUIRED}`;
    }

    if (!formData.subType) {
      newErrors.subType = `유형${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
    }

    if (!formData.frequency) {
      newErrors.frequency = `빈도${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
    }

    // 시작날짜 검증
    if (!formData.startDate && !formData.date) {
      newErrors.startDate = `시작 날짜${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
    } else {
      const startDateToCheck = formData.startDate || formData.date;
      if (startDateToCheck) {
        if (type === "medication") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(startDateToCheck);
          selectedDate.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            newErrors.startDate = VALIDATION_MESSAGES.START_DATE_PAST;
          }
        }
      }
    }

    // 종료날짜 검증
    if (type === "medication") {
      if (!formData.endDate) {
        newErrors.endDate = `종료 날짜${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
      }
    } else if (type === "care" || type === "vaccination") {
      if (formData.endDate) {
        if (formData.startDate && formData.endDate < formData.startDate) {
          newErrors.endDate = VALIDATION_MESSAGES.END_DATE_BEFORE_START;
        } else {
          const validation = validateEndDate(
            formData.startDate,
            formData.endDate,
            formData.frequency
          );
          if (!validation.valid) {
            newErrors.endDate = validation.message;
          }
        }
      }
    }

    // 일정 시간 검증
    if (!formData.scheduleTime && !formData.time) {
      newErrors.scheduleTime = `일정 시간${VALIDATION_MESSAGES.REQUIRED}`;
    }

    // 알림 시기 검증 (처방전이 아닌 경우에만)
    if (!isPrescription && !formData.notificationTiming) {
      newErrors.notificationTiming = `알림 시기${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
    }

    // 투약의 경우 복용 기간도 필수
    if (type === "medication" && !formData.duration) {
      newErrors.duration = `복용 기간${VALIDATION_MESSAGES.REQUIRED}`;
    } else if (
      type === "medication" &&
      (isNaN(formData.duration) || Number(formData.duration) <= 0)
    ) {
      newErrors.duration = VALIDATION_MESSAGES.INVALID_NUMBER;
    } else if (
      type === "medication" &&
      formData.startDate &&
      formData.duration
    ) {
      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(startDateObj);
      endDateObj.setDate(
        startDateObj.getDate() + Number(formData.duration) - 1
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDateObj.setHours(0, 0, 0, 0);

      if (endDateObj < today) {
        newErrors.duration = VALIDATION_MESSAGES.DURATION_INVALID;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, type, isPrescription, validateEndDate]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      subType: "",
      frequency: "",
      date: "",
      startDate: "",
      endDate: "",
      time: "",
      scheduleTime: "",
      duration: "",
      notificationTiming: "",
      lastReminderDaysBefore: null,
    });
    setErrors({});
    setIsPrescription(false);
  }, []);

  // 폼 데이터 설정 (편집 시 사용)
  const setFormDataFromSchedule = useCallback((scheduleData) => {
    if (!scheduleData) return;

    const frequency = (() => {
      if (type === "medication") {
        if (
          [
            "DAILY_ONCE",
            "DAILY_TWICE",
            "DAILY_THREE_TIMES",
            "WEEKLY_ONCE",
            "MONTHLY_ONCE",
          ].includes(scheduleData.frequency)
        ) {
          return scheduleData.frequency;
        }
        return frequencyMapping[scheduleData.frequency] || scheduleData.frequency || "";
      } else {
        return scheduleData.frequency || "";
      }
    })();

    const defaultTimes = getDefaultTimes(frequency);

    setFormData({
      name: scheduleData.name || "",
      subType: scheduleData.subType || scheduleData.type || "",
      frequency: frequency,
      date: scheduleData.date || scheduleData.startDate || "",
      startDate: scheduleData.startDate || scheduleData.date || "",
      endDate: scheduleData.endDate || scheduleData.date || "",
      time: scheduleData.time || scheduleData.scheduleTime || "",
      scheduleTime:
        scheduleData.scheduleTime ||
        scheduleData.time ||
        defaultTimes.join(", "),
      duration: scheduleData.duration || "",
      notificationTiming:
        scheduleData.reminderDaysBefore !== null &&
        scheduleData.reminderDaysBefore !== undefined
          ? String(scheduleData.reminderDaysBefore)
          : scheduleData.lastReminderDaysBefore !== null &&
            scheduleData.lastReminderDaysBefore !== undefined
          ? String(scheduleData.lastReminderDaysBefore)
          : "0",
      lastReminderDaysBefore: scheduleData.lastReminderDaysBefore || 0,
    });

    setIsPrescription(scheduleData.isPrescription || false);
  }, [type]);

  return {
    formData,
    errors,
    isPrescription,
    updateFormData,
    validateForm,
    resetForm,
    setFormDataFromSchedule,
    validateEndDate,
    getMinEndDate,
    getEndDateHint,
    getTimeInputCount: (frequency) => getTimeInputCount(frequency),
    getDefaultTimes: (frequency) => getDefaultTimes(frequency),
  };
}
