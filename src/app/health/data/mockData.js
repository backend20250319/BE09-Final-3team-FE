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
    type: "복용약",
    frequency: "하루에 두 번",
    scheduleTime: "09:00, 21:00",
    notificationTime: "08:30, 20:30",
    notificationTiming: "당일",
    startDate: "2025-08-01",
    endDate: "2025-08-07",
    icon: "💊",
    color: "#E3F2FD",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 2,
    name: "오메가-3",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "12:00",
    notificationTime: "11:30",
    notificationTiming: "1일전",
    startDate: "2025-08-01",
    endDate: "2025-08-30",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: true,
    petName: "초코",
  },
  {
    id: 3,
    name: "비타민 D",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "08:00",
    notificationTime: "07:30",
    notificationTiming: "당일",
    startDate: "2025-08-01",
    endDate: "2025-08-15",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: false,
    petName: "차차",
  },
  {
    id: 4,
    name: "칼슘 보충제",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "19:00",
    notificationTime: "18:30",
    notificationTiming: "2일전",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 5,
    name: "프로바이오틱스",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "10:00",
    notificationTime: "09:30",
    notificationTiming: "당일",
    startDate: "2025-08-01",
    endDate: "2025-08-20",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: false,
    petName: "초코",
  },
  {
    id: 6,
    name: "멀티비타민",
    type: "영양제",
    frequency: "하루에 한 번",
    scheduleTime: "07:30",
    notificationTime: "07:00",
    notificationTiming: "1일전",
    startDate: "2025-08-05",
    endDate: "2025-08-25",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: true,
    petName: "차차",
  },
  {
    id: 7,
    name: "글루코사민",
    type: "영양제",
    frequency: "하루에 두 번",
    scheduleTime: "09:00, 21:00",
    notificationTime: "08:30, 20:30",
    notificationTiming: "당일",
    startDate: "2025-08-03",
    endDate: "2025-08-17",
    icon: "💊",
    color: "#FFF3E0",
    isNotified: true,
    petName: "몽글이",
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
      type: "복용약", // 기본값으로 설정
      frequency: "1일 3회", // 처방전에서 실제 추출 가능한 정보
      duration: 7, // 처방전에서 실제 추출 가능한 정보
      startDate: new Date().toISOString().split("T")[0], // 업로드 당일로 자동 설정
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // duration 기반 자동 계산
      // 이하 필드들은 기본값으로 설정 (OCR로 추출 불가능)
      scheduleTime: "09:00", // 기본값
      notificationTiming: "당일", // 기본값
      icon: "💊",
      color: "#E3F2FD",
      isNotified: true,
    },
    {
      id: Date.now() + 2,
      name: "타이레놀 500mg",
      type: "복용약", // 기본값으로 설정
      frequency: "1일 2회", // 처방전에서 실제 추출 가능한 정보
      duration: 5, // 처방전에서 실제 추출 가능한 정보
      startDate: new Date().toISOString().split("T")[0], // 업로드 당일로 자동 설정
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // duration 기반 자동 계산
      // 이하 필드들은 기본값으로 설정 (OCR로 추출 불가능)
      scheduleTime: "09:00", // 기본값
      notificationTiming: "당일", // 기본값
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
    startDate: "2025-08-10",
    endDate: "2025-08-17",
    date: "2025-08-10", // 호환성을 위해 유지
    scheduleTime: "15:00",
    notificationTime: "14:30",
    notificationTiming: "당일",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 2,
    name: "미용",
    type: "돌봄",
    subType: "미용",
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    date: "2025-08-15", // 호환성을 위해 유지
    scheduleTime: "13:00",
    notificationTime: "12:30",
    notificationTiming: "1일전",
    frequency: "월 1회",
    icon: "✂️",
    color: "#FFF3E0",
    isNotified: false,
    petName: "초코",
  },
  {
    id: 3,
    name: "생일",
    type: "돌봄",
    subType: "생일",
    startDate: "2025-08-15",
    endDate: "2025-08-15",
    date: "2025-08-15", // 호환성을 위해 유지
    scheduleTime: "00:00",
    notificationTime: "23:30",
    notificationTiming: "당일",
    frequency: "연 1회",
    icon: "🎂",
    color: "#FCE4EC",
    isNotified: true,
    petName: "차차",
  },
  {
    id: 4,
    name: "산책",
    type: "돌봄",
    subType: "산책",
    startDate: "2025-08-11",
    endDate: "2025-08-18",
    date: "2025-08-11", // 호환성을 위해 유지
    scheduleTime: "15:00",
    notificationTime: "14:30",
    notificationTiming: "당일",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 5,
    name: "미용",
    type: "돌봄",
    subType: "미용",
    startDate: "2025-08-20",
    endDate: "2025-08-20",
    date: "2025-08-20", // 호환성을 위해 유지
    scheduleTime: "13:00",
    notificationTime: "12:30",
    notificationTiming: "2일전",
    frequency: "월 1회",
    icon: "✂️",
    color: "#FFF3E0",
    isNotified: false,
    petName: "초코",
  },
  {
    id: 6,
    name: "산책",
    type: "돌봄",
    subType: "산책",
    startDate: "2025-08-12",
    endDate: "2025-08-19",
    date: "2025-08-12", // 호환성을 위해 유지
    scheduleTime: "15:00",
    notificationTime: "14:30",
    notificationTiming: "당일",
    frequency: "매일 오후 3시",
    icon: "🐕",
    color: "#E8F5E8",
    isNotified: true,
    petName: "차차",
  },
  {
    id: 7,
    name: "약물 투여",
    type: "돌봄",
    subType: "기타",
    startDate: "2025-08-13",
    endDate: "2025-08-20",
    date: "2025-08-13", // 호환성을 위해 유지
    scheduleTime: "09:00",
    notificationTime: "08:45",
    notificationTiming: "당일",
    frequency: "매일",
    icon: "💊",
    color: "#F0F0F0",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 8,
    name: "사료 교체",
    type: "돌봄",
    subType: "기타",
    startDate: "2025-08-16",
    endDate: "2025-08-16",
    date: "2025-08-16", // 호환성을 위해 유지
    scheduleTime: "18:00",
    notificationTime: "17:30",
    notificationTiming: "1일전",
    frequency: "월 1회",
    icon: "🍽️",
    color: "#F0F0F0",
    isNotified: false,
    petName: "초코",
  },
  {
    id: 9,
    name: "체중 측정",
    type: "돌봄",
    subType: "기타",
    startDate: "2025-08-14",
    endDate: "2025-08-14",
    date: "2025-08-14", // 호환성을 위해 유지
    scheduleTime: "10:30",
    notificationTime: "10:15",
    notificationTiming: "2일전",
    frequency: "주 1회",
    icon: "⚖️",
    color: "#F0F0F0",
    isNotified: true,
    petName: "차차",
  },
];

export const defaultVaccinationSchedules = [
  {
    id: 4,
    name: "종합백신",
    type: "접종",
    subType: "예방접종",
    startDate: "2025-08-05",
    endDate: "2025-08-05",
    date: "2025-08-05", // 호환성을 위해 유지
    scheduleTime: "10:00",
    notificationTime: "09:30",
    notificationTiming: "당일",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 5,
    name: "광견병백신",
    type: "접종",
    subType: "예방접종",
    startDate: "2025-08-08",
    endDate: "2025-08-08",
    date: "2025-08-08", // 호환성을 위해 유지
    scheduleTime: "10:00",
    notificationTime: "09:30",
    notificationTiming: "1일전",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: false,
    petName: "초코",
  },
  {
    id: 6,
    name: "건강검진",
    type: "접종",
    subType: "건강검진",
    startDate: "2025-08-12",
    endDate: "2025-08-12",
    date: "2025-08-12", // 호환성을 위해 유지
    frequency: "반년 1회",
    scheduleTime: "14:00",
    notificationTime: "13:30",
    notificationTiming: "당일",
    icon: "🏥",
    color: "#F3E5F5",
    isNotified: true,
    petName: "차차",
  },
  {
    id: 7,
    name: "종합백신",
    type: "접종",
    subType: "예방접종",
    startDate: "2025-08-18",
    endDate: "2025-08-18",
    date: "2025-08-18", // 호환성을 위해 유지
    scheduleTime: "10:00",
    notificationTime: "09:30",
    notificationTiming: "2일전",
    frequency: "연 1회",
    icon: "💉",
    color: "#E3F2FD",
    isNotified: true,
    petName: "몽글이",
  },
  {
    id: 8,
    name: "건강검진",
    type: "접종",
    subType: "건강검진",
    startDate: "2025-08-25",
    endDate: "2025-08-25",
    date: "2025-08-25", // 호환성을 위해 유지
    scheduleTime: "14:00",
    notificationTime: "13:30",
    notificationTiming: "당일",
    frequency: "반년 1회",
    icon: "🏥",
    color: "#F3E5F5",
    isNotified: false,
    petName: "초코",
  },
];

// ========================================
// 3. 활동 관리 (ActivityManagement)
// ========================================

// 백엔드에서 enum으로 관리하므로 더미데이터 제거
// export const activityOptions = [
//   { value: "LOW", label: "거의 안 움직여요" },
//   { value: "MEDIUM_LOW", label: "가끔 산책해요" },
//   { value: "MEDIUM_HIGH", label: "자주 뛰어놀아요" },
//   { value: "HIGH", label: "매우 활동적이에요" },
// };

// export const validActivityLevels = ["LOW", "MEDIUM_LOW", "MEDIUM_HIGH", "HIGH"];

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
  기타: "📝",
  // 접종
  종합백신: "💉",
  광견병백신: "💉",
  건강검진: "🏥",
  예방접종: "💉",
  // 투약
  복용약: "💊",
  영양제: "💊",
};

// 색상 매핑
export const COLOR_MAP = {
  // 메인 카테고리
  투약: "#E3F2FD",
  돌봄: "#E8F5E8",
  접종: "#F3E5F5",
  // 투약
  복용약: "#E3F2FD",
  영양제: "#FFF3E0",
  // 돌봄
  산책: "#E8F5E8",
  미용: "#FFF3E0",
  생일: "#FCE4EC",
  기타: "#F0F0F0",
  // 접종
  예방접종: "#E3F2FD",
  건강검진: "#F3E5F5",
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

// 알림 시기 옵션들
export const notificationTimingOptions = ["당일", "1일전", "2일전", "3일전"];

// 돌봄 일정용 옵션들
export const careSubTypeOptions = ["산책", "미용", "생일", "기타"];

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

// ========================================
// 7. 활동 기록 조회용 더미 데이터
// ========================================

export const activityRecordData = {
  "몽글이_2025-01-15": {
    petName: "몽글이",
    walkingDistance: "2.5",
    activityLevel: "1.7",
    totalFoodWeight: "300",
    totalCaloriesInFood: "1200",
    feedingAmount: "150",
    weight: "15.2",
    sleepTime: "12",
    urineCount: "4",
    fecesCount: "2",
    memo: "오늘은 날씨가 좋아서 산책을 오래 했어요. 몽글이가 정말 즐거워했어요!",
    walk_calories: 212,
    eat_calories: 600,
    sleep_time: 12,
    urine_count: 4,
    feces_count: 2,
    activity_level: 1.7,
  },
  "몽글이_2025-01-14": {
    petName: "몽글이",
    walkingDistance: "1.8",
    activityLevel: "1.5",
    totalFoodWeight: "280",
    totalCaloriesInFood: "1100",
    feedingAmount: "140",
    weight: "15.1",
    sleepTime: "14",
    urineCount: "3",
    fecesCount: "1",
    memo: "비가 와서 실내에서만 놀았어요. 조금 지루해하는 것 같았어요.",
    walk_calories: 135,
    eat_calories: 550,
    sleep_time: 14,
    urine_count: 3,
    feces_count: 1,
    activity_level: 1.5,
  },
  "몽글이_2025-01-13": {
    petName: "몽글이",
    walkingDistance: "3.2",
    activityLevel: "1.9",
    totalFoodWeight: "320",
    totalCaloriesInFood: "1300",
    feedingAmount: "160",
    weight: "15.0",
    sleepTime: "10",
    urineCount: "5",
    fecesCount: "2",
    memo: "공원에서 다른 강아지들과 놀았어요. 정말 활발했어요!",
    walk_calories: 304,
    eat_calories: 650,
    sleep_time: 10,
    urine_count: 5,
    feces_count: 2,
    activity_level: 1.9,
  },
  "초코_2025-01-15": {
    petName: "초코",
    walkingDistance: "0.5",
    activityLevel: "1.2",
    totalFoodWeight: "200",
    totalCaloriesInFood: "800",
    feedingAmount: "100",
    weight: "4.5",
    sleepTime: "16",
    urineCount: "2",
    fecesCount: "1",
    memo: "고양이답게 대부분 시간을 잠자거나 창가에서 햇빛을 쬐며 보냈어요.",
    walk_calories: 30,
    eat_calories: 400,
    sleep_time: 16,
    urine_count: 2,
    feces_count: 1,
    activity_level: 1.2,
  },
  "차차_2025-01-15": {
    petName: "차차",
    walkingDistance: "0.1",
    activityLevel: "1.2",
    totalFoodWeight: "50",
    totalCaloriesInFood: "200",
    feedingAmount: "25",
    weight: "0.3",
    sleepTime: "18",
    urineCount: "3",
    fecesCount: "2",
    memo: "새장 안에서 노래를 불렀어요. 정말 예쁜 소리였어요!",
    walk_calories: 6,
    eat_calories: 100,
    sleep_time: 18,
    urine_count: 3,
    feces_count: 2,
    activity_level: 1.2,
  },
  "초코_2025-08-07": {
    petName: "초코",
    walkingDistance: "0.8",
    activityLevel: "1.4",
    totalFoodWeight: "220",
    totalCaloriesInFood: "900",
    feedingAmount: "110",
    weight: "4.8",
    sleepTime: "15",
    urineCount: "3",
    fecesCount: "1",
    memo: "오늘은 창가에서 새들을 관찰하는 시간이 많았어요. 고양이답게 조용하고 우아했어요. 간식도 잘 먹었고 전반적으로 건강한 하루였습니다.",
    walk_calories: 48,
    eat_calories: 450,
    sleep_time: 15,
    urine_count: 3,
    feces_count: 1,
    activity_level: 1.4,
  },
  "초코_2025-08-08": {
    petName: "초코",
    walkingDistance: "1.2",
    activityLevel: "1.6",
    totalFoodWeight: "240",
    totalCaloriesInFood: "950",
    feedingAmount: "120",
    weight: "4.9",
    sleepTime: "14",
    urineCount: "4",
    fecesCount: "2",
    memo: "오늘은 활발하게 놀았어요! 실내에서 공놀이도 하고 창가에서 햇빛도 쬐며 건강한 하루를 보냈습니다. 식사도 잘 했고 전반적으로 기분이 좋아 보였어요.",
    walk_calories: 72,
    eat_calories: 475,
    sleep_time: 14,
    urine_count: 4,
    feces_count: 2,
    activity_level: 1.6,
  },
  // 추가 더미데이터
  "몽글이_2024-12-25": {
    petName: "몽글이",
    walkingDistance: "2.0",
    activityLevel: "1.5",
    totalFoodWeight: "290",
    totalCaloriesInFood: "1150",
    feedingAmount: "145",
    weight: "15.3",
    sleepTime: "13",
    urineCount: "4",
    fecesCount: "2",
    memo: "크리스마스 날씨가 좋아서 산책을 즐겼어요!",
    walk_calories: 150,
    eat_calories: 575,
    sleep_time: 13,
    urine_count: 4,
    feces_count: 2,
    activity_level: 1.5,
  },
  "몽글이_2024-12-20": {
    petName: "몽글이",
    walkingDistance: "1.5",
    activityLevel: "1.2",
    totalFoodWeight: "270",
    totalCaloriesInFood: "1050",
    feedingAmount: "135",
    weight: "15.2",
    sleepTime: "15",
    urineCount: "3",
    fecesCount: "1",
    memo: "추워서 실내에서만 놀았어요.",
    walk_calories: 90,
    eat_calories: 525,
    sleep_time: 15,
    urine_count: 3,
    feces_count: 1,
    activity_level: 1.2,
  },
  "초코_2024-12-25": {
    petName: "초코",
    walkingDistance: "0.3",
    activityLevel: "1.2",
    totalFoodWeight: "180",
    totalCaloriesInFood: "750",
    feedingAmount: "90",
    weight: "4.4",
    sleepTime: "17",
    urineCount: "2",
    fecesCount: "1",
    memo: "크리스마스 트리 옆에서 잠을 잤어요.",
    walk_calories: 18,
    eat_calories: 375,
    sleep_time: 17,
    urine_count: 2,
    feces_count: 1,
    activity_level: 1.2,
  },
  "차차_2024-12-25": {
    petName: "차차",
    walkingDistance: "0.05",
    activityLevel: "1.2",
    totalFoodWeight: "45",
    totalCaloriesInFood: "180",
    feedingAmount: "22",
    weight: "0.3",
    sleepTime: "19",
    urineCount: "2",
    fecesCount: "1",
    memo: "크리스마스 노래를 불렀어요!",
    walk_calories: 3,
    eat_calories: 90,
    sleep_time: 19,
    urine_count: 2,
    feces_count: 1,
    activity_level: 1.2,
  },
  "몽글이_2024-11-15": {
    petName: "몽글이",
    walkingDistance: "2.8",
    activityLevel: "1.7",
    totalFoodWeight: "310",
    totalCaloriesInFood: "1250",
    feedingAmount: "155",
    weight: "15.1",
    sleepTime: "11",
    urineCount: "5",
    fecesCount: "2",
    memo: "가을 날씨가 좋아서 산책을 오래 했어요!",
    walk_calories: 238,
    eat_calories: 625,
    sleep_time: 11,
    urine_count: 5,
    feces_count: 2,
    activity_level: 1.7,
  },
  "초코_2024-11-15": {
    petName: "초코",
    walkingDistance: "0.4",
    activityLevel: "1.2",
    totalFoodWeight: "190",
    totalCaloriesInFood: "780",
    feedingAmount: "95",
    weight: "4.3",
    sleepTime: "16",
    urineCount: "3",
    fecesCount: "1",
    memo: "창가에서 가을 낙엽을 구경했어요.",
    walk_calories: 24,
    eat_calories: 390,
    sleep_time: 16,
    urine_count: 3,
    feces_count: 1,
    activity_level: 1.2,
  },
  "차차_2024-11-15": {
    petName: "차차",
    walkingDistance: "0.08",
    activityLevel: "1.2",
    totalFoodWeight: "48",
    totalCaloriesInFood: "190",
    feedingAmount: "24",
    weight: "0.3",
    sleepTime: "18",
    urineCount: "3",
    fecesCount: "2",
    memo: "가을 노래를 불렀어요!",
    walk_calories: 5,
    eat_calories: 95,
    sleep_time: 18,
    urine_count: 3,
    feces_count: 2,
    activity_level: 1.2,
  },
  "몽글이_2025-08-08": {
    petName: "몽글이",
    walkingDistance: "3.5",
    activityLevel: "1.8",
    totalFoodWeight: "330",
    totalCaloriesInFood: "1350",
    feedingAmount: "165",
    weight: "15.4",
    sleepTime: "11",
    urineCount: "5",
    fecesCount: "2",
    memo: "오늘은 공원에서 다른 강아지들과 정말 즐겼어요! 산책도 오래 했고 운동도 많이 했어요. 식사도 잘 했고 건강한 하루였습니다.",
    walk_calories: 315,
    eat_calories: 675,
    sleep_time: 11,
    urine_count: 5,
    feces_count: 2,
    activity_level: 1.8,
  },
  "차차_2025-08-08": {
    petName: "차차",
    walkingDistance: "0.15",
    activityLevel: "1.3",
    totalFoodWeight: "55",
    totalCaloriesInFood: "220",
    feedingAmount: "28",
    weight: "0.32",
    sleepTime: "17",
    urineCount: "4",
    fecesCount: "2",
    memo: "오늘은 새장에서 활발하게 노래를 불렀어요! 정말 예쁜 소리였고 기분이 좋아 보였어요.",
    walk_calories: 9,
    eat_calories: 110,
    sleep_time: 17,
    urine_count: 4,
    feces_count: 2,
    activity_level: 1.3,
  },
};

// 활동 기록이 있는 날짜 목록
export const activityRecordDates = [
  "2025-01-15",
  "2025-01-14",
  "2025-01-13",
  "2025-01-10",
  "2025-01-08",
  "2025-01-05",
  "2025-01-02",
  "2024-12-30",
  "2024-12-28",
  "2024-12-25",
  "2024-12-20",
  "2024-12-18",
  "2024-12-15",
  "2024-12-12",
  "2024-12-10",
  "2024-12-08",
  "2024-12-05",
  "2024-12-03",
  "2024-12-01",
  "2024-11-28",
  "2024-11-25",
  "2024-11-22",
  "2024-11-20",
  "2024-11-18",
  "2024-11-15",
  "2024-11-12",
  "2024-11-10",
  "2024-11-08",
  "2024-11-05",
  "2024-11-02",
  "2024-10-30",
  "2024-10-28",
  "2024-10-25",
  "2024-10-22",
  "2024-10-20",
  "2024-10-18",
  "2024-10-15",
  "2024-10-12",
  "2024-10-10",
  "2024-10-08",
  "2024-10-05",
  "2024-10-02",
  "2024-09-30",
  "2024-09-28",
  "2024-09-25",
  "2024-09-22",
  "2024-09-20",
  "2024-09-18",
  "2024-09-15",
  "2024-09-12",
  "2024-09-10",
  "2024-09-08",
  "2024-09-05",
  "2024-09-02",
  "2024-08-30",
  "2024-08-28",
  "2024-08-25",
  "2024-08-22",
  "2024-08-20",
  "2024-08-18",
  "2024-08-15",
  "2024-08-12",
  "2024-08-10",
  "2024-08-08",
  "2024-08-05",
  "2024-08-02",
  "2024-07-30",
  "2024-07-28",
  "2024-07-25",
  "2024-07-22",
  "2024-07-20",
  "2024-07-18",
  "2024-07-15",
  "2024-07-12",
  "2024-07-10",
  "2024-07-08",
  "2024-07-05",
  "2024-07-02",
  "2024-06-30",
  "2024-06-28",
  "2024-06-25",
  "2024-06-22",
  "2024-06-20",
  "2024-06-18",
  "2024-06-15",
  "2024-06-12",
  "2024-06-10",
  "2024-06-08",
  "2024-06-05",
  "2024-06-02",
  "2024-05-30",
  "2024-05-28",
  "2024-05-25",
  "2024-05-22",
  "2024-05-20",
  "2024-05-18",
  "2024-05-15",
  "2024-05-12",
  "2024-05-10",
  "2024-05-08",
  "2024-05-05",
  "2024-05-02",
  "2024-04-30",
  "2024-04-28",
  "2024-04-25",
  "2024-04-22",
  "2024-04-20",
  "2024-04-18",
  "2024-04-15",
  "2024-04-12",
  "2024-04-10",
  "2024-04-08",
  "2024-04-05",
  "2024-04-02",
  "2024-03-30",
  "2024-03-28",
  "2024-03-25",
  "2024-03-22",
  "2024-03-20",
  "2024-03-18",
  "2024-03-15",
  "2024-03-12",
  "2024-03-10",
  "2024-03-08",
  "2024-03-05",
  "2024-03-02",
  "2024-02-29",
  "2024-02-27",
  "2024-02-25",
  "2024-02-22",
  "2024-02-20",
  "2024-02-18",
  "2024-02-15",
  "2024-02-12",
  "2024-02-10",
  "2024-02-08",
  "2024-02-05",
  "2024-02-02",
  "2024-01-30",
  "2024-01-28",
  "2024-01-25",
  "2024-01-22",
  "2024-01-20",
  "2024-01-18",
  "2024-01-15",
  "2024-01-12",
  "2024-01-10",
  "2024-01-08",
  "2024-01-05",
  "2024-01-02",
  "2025-08-07",
  "2025-08-08",
];

// 특정 펫의 활동 기록 날짜 가져오기
export const getActivityRecordDates = (petName) => {
  return activityRecordDates.filter((date) => {
    const key = `${petName}_${date}`;
    return activityRecordData[key];
  });
};

// 특정 날짜의 활동 기록 가져오기
export const getActivityRecord = (petName, date) => {
  const key = `${petName}_${date}`;
  return activityRecordData[key] || null;
};
