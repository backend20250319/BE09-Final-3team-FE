// ========================================
// 투약 관련 상수
// ========================================

// 투약 타입 옵션
export const medicationTypeOptions = ["복용약", "영양제"];

// 복용 빈도 옵션 (영어 enum 값 사용, 투약은 하루 단위만)
export const medicationFrequencyOptions = [
  { value: "DAILY_ONCE", label: "하루에 한 번" },
  { value: "DAILY_TWICE", label: "하루에 두 번" },
  { value: "DAILY_THREE", label: "하루에 세 번" },
];

// 복용 빈도 매핑 객체 (영어 ↔ 한글 변환, 투약은 하루 단위만)
export const frequencyMapping = {
  // 영어 → 한글
  DAILY_ONCE: "하루에 한 번",
  DAILY_TWICE: "하루에 두 번",
  DAILY_THREE: "하루에 세 번",

  // 한글 → 영어
  "하루에 한 번": "DAILY_ONCE",
  "하루에 두 번": "DAILY_TWICE",
  "하루에 세 번": "DAILY_THREE",

  // OCR 형태 → 영어 (추가)
  "하루 1회": "DAILY_ONCE",
  "하루 2회": "DAILY_TWICE",
  "하루 3회": "DAILY_THREE",

  // OCR 형태 → 한글 (추가)
  "하루 1회": "하루에 한 번",
  "하루 2회": "하루에 두 번",
  "하루 3회": "하루에 세 번",

  // 띄어쓰기 없는 형태 → 띄어쓰기 있는 형태 (통일)
  "하루에 한번": "하루에 한 번",
  "하루에 두번": "하루에 두 번",
  "하루에 세번": "하루에 세 번",
};
