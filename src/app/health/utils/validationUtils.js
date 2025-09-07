// ========================================
// 검증 관련 유틸리티 함수들
// ========================================

import { VALIDATION_MESSAGES } from "../constants";

// 파일 업로드 검증
export const validateFileUpload = (file, maxSize, allowedTypes) => {
  const errors = [];

  if (!file) {
    errors.push("파일을 선택해주세요.");
    return { valid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`파일 크기는 ${maxSize / (1024 * 1024)}MB 이하여야 합니다.`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push("지원하지 않는 파일 형식입니다.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// 날짜 검증
export const validateDate = (dateString, type = "general") => {
  if (!dateString) {
    return { valid: false, message: "날짜를 선택해주세요." };
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(date.getTime())) {
    return { valid: false, message: "유효한 날짜를 선택해주세요." };
  }

  if (type === "medication") {
    date.setHours(0, 0, 0, 0);
    if (date < today) {
      return { valid: false, message: VALIDATION_MESSAGES.START_DATE_PAST };
    }
  }

  return { valid: true };
};

// 종료날짜 검증
export const validateEndDate = (startDate, endDate, frequency) => {
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
};

// 복용 기간 검증
export const validateDuration = (duration, startDate) => {
  if (!duration) {
    return { valid: false, message: "복용 기간을 입력해주세요." };
  }

  const durationNum = Number(duration);
  if (isNaN(durationNum) || durationNum <= 0) {
    return { valid: false, message: VALIDATION_MESSAGES.INVALID_NUMBER };
  }

  if (startDate) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + durationNum - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < today) {
      return { valid: false, message: VALIDATION_MESSAGES.DURATION_INVALID };
    }
  }

  return { valid: true };
};

// 시간 검증
export const validateTime = (timeString) => {
  if (!timeString) {
    return { valid: false, message: "시간을 선택해주세요." };
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return { valid: false, message: "올바른 시간 형식을 입력해주세요. (HH:MM)" };
  }

  return { valid: true };
};

// 알림 시기 검증
export const validateNotificationTiming = (timing, isPrescription = false) => {
  if (isPrescription) {
    return { valid: true }; // 처방전은 알림 시기 검증 생략
  }

  if (!timing) {
    return { valid: false, message: "알림 시기를 선택해주세요." };
  }

  const timingNum = Number(timing);
  if (isNaN(timingNum) || timingNum < 0) {
    return { valid: false, message: "올바른 알림 시기를 선택해주세요." };
  }

  return { valid: true };
};

// 폼 전체 검증
export const validateMedicalForm = (formData, type, isPrescription = false) => {
  const errors = {};

  // 이름 검증
  if (!formData.name?.trim()) {
    errors.name = `${type === "medication" ? "약 이름" : "일정 이름"}${VALIDATION_MESSAGES.REQUIRED}`;
  }

  // 유형 검증
  if (!formData.subType) {
    errors.subType = `유형${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
  }

  // 빈도 검증
  if (!formData.frequency) {
    errors.frequency = `빈도${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
  }

  // 시작날짜 검증
  const startDateValidation = validateDate(
    formData.startDate || formData.date,
    type === "medication" ? "medication" : "general"
  );
  if (!startDateValidation.valid) {
    errors.startDate = startDateValidation.message;
  }

  // 종료날짜 검증
  if (type === "medication") {
    if (!formData.endDate) {
      errors.endDate = `종료 날짜${VALIDATION_MESSAGES.SELECT_REQUIRED}`;
    } else {
      const endDateValidation = validateEndDate(
        formData.startDate || formData.date,
        formData.endDate,
        formData.frequency
      );
      if (!endDateValidation.valid) {
        errors.endDate = endDateValidation.message;
      }
    }
  } else if (type === "care" || type === "vaccination") {
    if (formData.endDate) {
      const endDateValidation = validateEndDate(
        formData.startDate || formData.date,
        formData.endDate,
        formData.frequency
      );
      if (!endDateValidation.valid) {
        errors.endDate = endDateValidation.message;
      }
    }
  }

  // 일정 시간 검증
  const timeValidation = validateTime(formData.scheduleTime || formData.time);
  if (!timeValidation.valid) {
    errors.scheduleTime = timeValidation.message;
  }

  // 알림 시기 검증
  const notificationValidation = validateNotificationTiming(
    formData.notificationTiming,
    isPrescription
  );
  if (!notificationValidation.valid) {
    errors.notificationTiming = notificationValidation.message;
  }

  // 투약의 경우 복용 기간 검증
  if (type === "medication") {
    const durationValidation = validateDuration(
      formData.duration,
      formData.startDate || formData.date
    );
    if (!durationValidation.valid) {
      errors.duration = durationValidation.message;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
