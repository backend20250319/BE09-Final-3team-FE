// ========================================
// 일정 관련 상수
// ========================================

// 알림 시기 옵션
export const notificationTimingOptions = [
  { value: "0", label: "당일" },
  { value: "1", label: "1일 전" },
  { value: "2", label: "2일 전" },
  { value: "3", label: "3일 전" },
];

// 투약 필터 옵션
export const medicationFilterOptions = [
  { value: "전체", label: "전체" },
  { value: "복용약", label: "복용약" },
  { value: "영양제", label: "영양제" },
  { value: "처방전", label: "처방전" },
];

// 돌봄 필터 옵션 (서브타입 기반)
export const careFilterOptions = [
  { value: "전체", label: "전체" },
  { value: "WALK", label: "산책" },
  { value: "BIRTHDAY", label: "생일" },
  { value: "GROOMING", label: "미용" },
  { value: "ETC", label: "기타" },
];

// 접종 필터 옵션 (서브타입 기반)
export const vaccinationFilterOptions = [
  { value: "전체", label: "전체" },
  { value: "VACCINE", label: "예방접종" },
  { value: "CHECKUP", label: "건강검진" },
];

// 페이징 설정
export const PAGINATION_CONFIG = {
  MEDICATION: {
    itemsPerPage: 3,
  },
  CARE: {
    itemsPerPage: 3,
  },
  VACCINATION: {
    itemsPerPage: 2,
  },
};

// 시간 관련 상수
export const TIME_CONFIG = {
  DEFAULT_TIME: "09:00",
  VACCINATION_DEFAULT_TIME: "10:00",
  TIME_INTERVAL: 30, // 30분 간격
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
};

// 파일 업로드 관련 상수
export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
};

// 빈도별 기본 시간 설정
export const getDefaultTimes = (frequency) => {
  switch (frequency) {
    case "DAILY_ONCE":
      return ["09:00"];
    case "DAILY_TWICE":
      return ["08:00", "20:00"];
    case "DAILY_THREE":
      return ["08:00", "12:00", "20:00"];
    default:
      return ["09:00"];
  }
};

// 빈도별 시간 입력 칸 개수
export const getTimeInputCount = (frequency) => {
  switch (frequency) {
    case "DAILY_ONCE":
      return 1;
    case "DAILY_TWICE":
      return 2;
    case "DAILY_THREE":
      return 3;
    default:
      return 1;
  }
};

// 약물명에 따른 아이콘 결정
export const getMedicationIcon = (medicationName) => {
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

// 시간 형식 변환 (HH:MM:SS -> HH:MM)
export const formatTime = (timeString) => {
  if (!timeString) return "09:00";

  // "08:00:00" -> "08:00" 변환
  if (timeString.includes(":")) {
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }

  return timeString;
};

// 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 시간대 사용)
export const formatDateToLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 날짜 포맷팅 함수 (표시용)
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
};
