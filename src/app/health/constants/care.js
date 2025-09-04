// ========================================
// 돌봄 관련 상수
// ========================================

// 돌봄 일정용 옵션들 (백엔드 스펙에 맞게 수정)
export const careSubTypeOptions = [
  "WALK", // 산책
  "BIRTHDAY", // 생일
  "GROOMING", // 미용
  "ETC", // 기타
];

export const careFrequencyOptions = ["매일", "매주", "매월", "당일"];

export const careFrequencyMapping = {
  매일: "DAILY",
  매주: "WEEKLY",
  매월: "MONTHLY",
  당일: "SINGLE_DAY",

  // 영어 → 한글
  DAILY: "매일",
  WEEKLY: "매주",
  MONTHLY: "매월",
  SINGLE_DAY: "당일",
};
