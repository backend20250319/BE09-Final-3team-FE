// ========================================
// 투약 관련 상수
// ========================================

// 투약 타입 옵션
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
