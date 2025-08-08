// ========================================
// Health 모듈 더미 데이터
// ========================================

// ========================================
// 1. 투약 관리 (MedicationManagement)
// ========================================

export const defaultMedications = [
  {
    id: 1,
    name: "오메가 1.5mg",
    type: "항생제",
    frequency: "하루에 두 번",
    scheduleTime: "09:00, 21:00",
    notificationTime: "08:30, 20:30",
    startDate: "2025-01-01",
    endDate: "2025-01-07",
    icon: "💊",
    color: "#E3F2FD",
    isNotified: true,
  },
  {
    id: 2,
    name: "오메가-3",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "12:00",
    notificationTime: "11:30",
    startDate: "2025-01-01",
    endDate: "2025-01-30",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: true,
  },
  {
    id: 3,
    name: "비타민 D",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "08:00",
    notificationTime: "07:30",
    startDate: "2025-01-01",
    endDate: "2025-01-15",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: false,
  },
];

// 처방전 OCR 시뮬레이션 데이터
export const mockPrescriptionData = {
  originalText:
    "아목시실린 500mg 1일 3회 7일간 복용\n타이레놀 500mg 1일 2회 5일간 복용",
  extractedMedications: [
    {
      id: Date.now() + 1,
      name: "아목시실린 500mg",
      type: "복용약",
      frequency: "하루에 세 번",
      scheduleTime: "08:00, 14:00, 20:00",
      notificationTime: "07:30, 13:30, 19:30",
      duration: 7,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      icon: "💊",
      color: "#E3F2FD",
      isNotified: true,
    },
    {
      id: Date.now() + 2,
      name: "타이레놀 500mg",
      type: "복용약",
      frequency: "하루에 두 번",
      scheduleTime: "09:00, 21:00",
      notificationTime: "08:30, 20:30",
      duration: 5,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      icon: "💊",
      color: "#E3F2FD",
      isNotified: true,
    },
  ],
  uploadTime: new Date().toISOString(),
  fileName: "prescription_001.jpg",
};

// ========================================
// 2. 돌봄 일정 관리 (CareSchedule)
// ========================================

export const defaultCareSchedules = [
  {
    id: 1,
    name: "산책",
    type: "돌봄",
    subType: "산책",
    date: "2025-08-10",
    scheduleTime: "15:00",
    notificationTime: "14:30",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
  },
  {
    id: 2,
    name: "미용",
    type: "돌봄",
    subType: "미용",
    date: "2025-08-15",
    scheduleTime: "13:00",
    notificationTime: "12:30",
    frequency: "월 1회",
    icon: "✂️",
    color: "#FFF3E0",
    isNotified: false,
  },
  {
    id: 3,
    name: "생일",
    type: "돌봄",
    subType: "생일",
    date: "2025-08-15",
    scheduleTime: "00:00",
    notificationTime: "23:30",
    frequency: "연 1회",
    icon: "🎂",
    color: "#FCE4EC",
    isNotified: true,
  },
  {
    id: 4,
    name: "산책",
    type: "돌봄",
    subType: "산책",
    date: "2025-08-11",
    scheduleTime: "15:00",
    notificationTime: "14:30",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
  },
  {
    id: 5,
    name: "미용",
    type: "돌봄",
    subType: "미용",
    date: "2025-08-20",
    scheduleTime: "13:00",
    notificationTime: "12:30",
    frequency: "월 1회",
    icon: "✂️",
    color: "#FFF3E0",
    isNotified: false,
  },
  {
    id: 6,
    name: "산책",
    type: "돌봄",
    subType: "산책",
    date: "2025-08-12",
    scheduleTime: "15:00",
    notificationTime: "14:30",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
  },
];

export const defaultVaccinationSchedules = [
  {
    id: 4,
    name: "종합백신",
    type: "접종",
    subType: "예방접종",
    date: "2025-09-01",
    scheduleTime: "10:00",
    notificationTime: "09:30",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: true,
  },
  {
    id: 5,
    name: "광견병백신",
    type: "접종",
    subType: "예방접종",
    date: "2025-09-02",
    scheduleTime: "10:00",
    notificationTime: "09:30",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: false,
  },
  {
    id: 6,
    name: "건강검진",
    type: "접종",
    subType: "건강검진",
    frequency: "반년 1회",
    scheduleTime: "14:00",
    notificationTime: "13:30",
    icon: "🏥",
    color: "#F3E5F5",
    isNotified: true,
  },
  {
    id: 7,
    name: "종합백신",
    type: "접종",
    subType: "예방접종",
    date: "2025-09-15",
    scheduleTime: "10:00",
    notificationTime: "09:30",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: true,
  },
  {
    id: 8,
    name: "건강검진",
    type: "접종",
    subType: "건강검진",
    date: "2025-09-20",
    scheduleTime: "14:00",
    notificationTime: "13:30",
    frequency: "반년 1회",
    icon: "🏥",
    color: "#F3E5F5",
    isNotified: false,
  },
];

// ========================================
// 3. 활동 관리 (ActivityManagement)
// ========================================

export const activityOptions = [
  { value: "1.2", label: "거의 안 움직여요" },
  { value: "1.5", label: "가끔 산책해요" },
  { value: "1.7", label: "자주 뛰어놀아요" },
  { value: "1.9", label: "매우 활동적이에요" },
];

export const validActivityLevels = ["1.2", "1.5", "1.7", "1.9"];

// 초기 폼 데이터
export const initialFormData = {
  walkingDistance: "",
  activityLevel: "",
  totalFoodWeight: "",
  totalCaloriesInFood: "",
  feedingAmount: "",
  weight: "",
  sleepTime: "",
  urineCount: "",
  fecesCount: "",
  memo: "",
};

// 계산된 값 초기 상태
export const initialCalculated = {
  recommendedBurn: 0,
  actualBurn: 0,
  recommendedIntake: 0,
  actualIntake: 0,
};

// ========================================
// 4. 활동 리포트 (ActivityReport)
// ========================================

export const activityMetrics = [
  {
    id: 1,
    title: "산책 소모 칼로리",
    icon: "/health/footprint.png",
    colorActual: "#8BC34A",
    colorRecommended: "#AED581",
    type: "bar",
    hasRecommended: true,
  },
  {
    id: 2,
    title: "섭취 칼로리",
    icon: "/health/meal.png",
    colorActual: "#F5A623",
    colorRecommended: "#F8C471",
    type: "bar",
    hasRecommended: true,
  },
  {
    id: 3,
    title: "배변 횟수",
    icon: "/health/bathroom.png",
    colorActual: "#FF7675",
    colorRecommended: null,
    type: "line",
    hasRecommended: false,
  },
  {
    id: 4,
    title: "수면 시간",
    icon: "/health/sleep.png",
    colorActual: "#de74ffff",
    colorRecommended: null,
    type: "area",
    hasRecommended: false,
  },
];

// actualValue Bar의 이름 매핑
export const actualNameMap = {
  "산책 소모 칼로리": "소모량",
  "섭취 칼로리": "식사량",
};

// 일별 데이터
export const dailyData = {
  common: [
    { day: "월", actualValue: 85, recommendedValue: 100 },
    { day: "화", actualValue: 65, recommendedValue: 100 },
    { day: "수", actualValue: 45, recommendedValue: 100 },
    { day: "목", actualValue: 25, recommendedValue: 100 },
    { day: "금", actualValue: 20, recommendedValue: 100 },
    { day: "토", actualValue: 35, recommendedValue: 100 },
    { day: "일", actualValue: 30, recommendedValue: 100 },
  ],
  poop: [
    { day: "월", 소변: 3, 대변: 1 },
    { day: "화", 소변: 2, 대변: 1 },
    { day: "수", 소변: 4, 대변: 2 },
    { day: "목", 소변: 3, 대변: 1 },
    { day: "금", 소변: 2, 대변: 1 },
    { day: "토", 소변: 1, 대변: 1 },
    { day: "일", 소변: 3, 대변: 2 },
  ],
};

// 주별 데이터
export const weeklyData = {
  common: [
    { week: "1주", actualValue: 450, recommendedValue: 500 },
    { week: "2주", actualValue: 500, recommendedValue: 500 },
    { week: "3주", actualValue: 480, recommendedValue: 500 },
    { week: "4주", actualValue: 520, recommendedValue: 500 },
  ],
  poop: [
    { week: "1주", 소변: 18, 대변: 7 },
    { week: "2주", 소변: 20, 대변: 8 },
    { week: "3주", 소변: 19, 대변: 9 },
    { week: "4주", 소변: 22, 대변: 7 },
  ],
};

// 월별 데이터
export const monthlyData = {
  common: [
    { month: "1월", actualValue: 1800, recommendedValue: 2000 },
    { month: "2월", actualValue: 1900, recommendedValue: 2000 },
    { month: "3월", actualValue: 2100, recommendedValue: 2000 },
    { month: "4월", actualValue: 1950, recommendedValue: 2000 },
    { month: "5월", actualValue: 2200, recommendedValue: 2000 },
    { month: "6월", actualValue: 1850, recommendedValue: 2000 },
  ],
  poop: [
    { month: "1월", 소변: 75, 대변: 30 },
    { month: "2월", 소변: 80, 대변: 32 },
    { month: "3월", 소변: 85, 대변: 35 },
    { month: "4월", 소변: 78, 대변: 31 },
    { month: "5월", 소변: 90, 대변: 38 },
    { month: "6월", 소변: 82, 대변: 33 },
  ],
};

// 연별 데이터
export const yearlyData = {
  common: [
    { year: "2022", actualValue: 24000, recommendedValue: 25000 },
    { year: "2023", actualValue: 25000, recommendedValue: 25000 },
    { year: "2024", actualValue: 26000, recommendedValue: 25000 },
  ],
  poop: [
    { year: "2022", 소변: 900, 대변: 400 },
    { year: "2023", 소변: 920, 대변: 410 },
    { year: "2024", 소변: 940, 대변: 420 },
  ],
};

// ========================================
// 5. 공통 설정 및 상수
// ========================================

// LocalStorage 키 상수
export const STORAGE_KEYS = {
  MEDICATION_NOTIFICATIONS: "medication_notifications",
  ACTIVITY_DATA: (petName, date) => `${petName}_${date}`,
};

// 아이콘 매핑
export const ICON_MAP = {
  // 돌봄
  산책: "🐕",
  미용: "✂️",
  생일: "🎂",
  // 접종
  종합백신: "💉",
  광견병백신: "💉",
  건강검진: "🏥",
  // 투약
  복용약: "💊",
  영양제: "💊",
  기타: "📅",
};

// 색상 매핑
export const COLOR_MAP = {
  돌봄: "#E8F5E8",
  접종: "#E3F2FD",
  복용약: "#E3F2FD",
  영양제: "#FFF3E0",
};

// 유틸리티 함수들
export const formatNumber = (num) => {
  if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(1);
  }
};

export const getTodayKey = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ========================================
// 6. 모달 옵션 데이터
// ========================================

// 투약용 옵션들
export const medicationTypeOptions = ["복용약", "영양제"];

export const medicationFrequencyOptions = [
  "하루에 한 번",
  "하루에 두 번",
  "하루에 세 번",
  "주에 한 번",
  "월에 한 번",
];

// 돌봄 일정용 옵션들
export const careSubTypeOptions = ["산책", "미용", "생일"];

export const careFrequencyOptions = [
  "매일",
  "매주",
  "매월",
  "연 1회",
  "반년 1회",
  "월 1회",
  "주 1회",
  "기타",
];

// 접종 일정용 옵션들
export const vaccinationSubTypeOptions = ["예방접종", "건강검진"];

export const vaccinationFrequencyOptions = [
  "연 1회",
  "반년 1회",
  "월 1회",
  "주 1회",
  "기타",
];
