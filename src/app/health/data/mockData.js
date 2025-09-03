// ========================================
// Health 모듈 설정 데이터
// ========================================

// 투약용 옵션들
export const medicationTypeOptions = ["복용약", "영양제"];

// 복용 빈도 옵션 (영어 enum 값 사용)
export const medicationFrequencyOptions = [
  { value: "DAILY_ONCE", label: "하루에 한 번" },
  { value: "DAILY_TWICE", label: "하루에 두 번" },
  { value: "DAILY_THREE_TIMES", label: "하루에 세 번" },
  { value: "WEEKLY_ONCE", label: "주에 한 번" },
  { value: "MONTHLY_ONCE", label: "월에 한 번" },
];

// 복용 빈도 매핑 객체 (영어 ↔ 한글 변환)
export const frequencyMapping = {
  // 영어 → 한글
  DAILY_ONCE: "하루에 한 번",
  DAILY_TWICE: "하루에 두 번",
  DAILY_THREE_TIMES: "하루에 세 번",
  WEEKLY_ONCE: "주에 한 번",
  MONTHLY_ONCE: "월에 한 번",

  // 한글 → 영어
  "하루에 한 번": "DAILY_ONCE",
  "하루에 두 번": "DAILY_TWICE",
  "하루에 세 번": "DAILY_THREE_TIMES",
  "주에 한 번": "WEEKLY_ONCE",
  "월에 한 번": "MONTHLY_ONCE",

  // OCR 형태 → 영어 (추가)
  "하루 1회": "DAILY_ONCE",
  "하루 2회": "DAILY_TWICE",
  "하루 3회": "DAILY_THREE_TIMES",
  "주 1회": "WEEKLY_ONCE",
  "월 1회": "MONTHLY_ONCE",

  // OCR 형태 → 한글 (추가)
  "하루 1회": "하루에 한 번",
  "하루 2회": "하루에 두 번",
  "하루 3회": "하루에 세 번",
  "주 1회": "주에 한 번",
  "월 1회": "월에 한 번",
};

// 알림 시기 옵션들
export const notificationTimingOptions = [
  { value: 0, label: "당일" },
  { value: 1, label: "1일전" },
  { value: 2, label: "2일전" },
  { value: 3, label: "3일전" },
];

// 돌봄 일정용 옵션들
export const careSubTypeOptions = [
  "목욕",
  "털빗기",
  "귀청소",
  "발톱깎기",
  "치아관리",
  "눈관리",
  "기타",
];

export const careFrequencyOptions = [
  "매일",
  "주 2회",
  "주 1회",
  "월 2회",
  "월 1회",
];

// 예방접종 일정용 옵션들
export const vaccinationSubTypeOptions = [
  "종합백신",
  "켄넬코프",
  "광견병",
  "심장사상충",
  "기생충",
  "기타",
];

export const vaccinationFrequencyOptions = [
  "매년",
  "6개월마다",
  "3개월마다",
  "월 1회",
  "1회만",
];

// 아이콘 매핑
export const ICON_MAP = {
  // 투약
  복용약: "💊",
  영양제: "💊",

  // 돌봄
  목욕: "🛁",
  털빗기: "🪶",
  귀청소: "👂",
  발톱깎기: "✂️",
  치아관리: "🦷",
  눈관리: "👁️",
  기타: "🔧",

  // 예방접종
  종합백신: "💉",
  켄넬코프: "💉",
  광견병: "💉",
  심장사상충: "💉",
  기생충: "💉",
  기타: "💉",
};

// 색상 매핑
export const COLOR_MAP = {
  // 투약
  복용약: "#E3F2FD",
  영양제: "#FFF3E0",

  // 돌봄
  목욕: "#E8F5E8",
  털빗기: "#F3E5F5",
  귀청소: "#E0F2F1",
  발톱깎기: "#FFF8E1",
  치아관리: "#E3F2FD",
  눈관리: "#FCE4EC",
  기타: "#F5F5F5",

  // 예방접종
  종합백신: "#FFEBEE",
  켄넬코프: "#E8F5E8",
  광견병: "#FFF3E0",
  심장사상충: "#E3F2FD",
  기생충: "#F3E5F5",
  기타: "#F5F5F5",
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  NOTIFICATION_STATUS: "notificationStatus",
  MEDICATION_NOTIFICATIONS: "medicationNotifications",
  CARE_NOTIFICATIONS: "careNotifications",
  VACCINATION_NOTIFICATIONS: "vaccinationNotifications",
};

// OCR 처리를 위한 더미 처방전 데이터 (테스트용)
export const mockPrescriptionData = {
  drugName: "오메가-3",
  frequency: "하루에 한 번",
  times: ["09:00"],
  prescriptionDays: 7,
};

// 활동 관리용 초기 데이터
export const initialFormData = {
  activityLevel: "",
  duration: "",
  intensity: "",
  notes: "",
  memo: "",
  walkingDistance: "",
  totalFoodWeight: "",
  totalCaloriesInFood: "",
  feedingAmount: "",
  weight: "",
  sleepTime: "",
  urineCount: "",
  fecesCount: "",
  mealType: "BREAKFAST",
};

export const initialCalculated = {
  calories: 0,
  distance: 0,
  steps: 0,
};

// 숫자 포맷팅 함수
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return num.toLocaleString();
};
