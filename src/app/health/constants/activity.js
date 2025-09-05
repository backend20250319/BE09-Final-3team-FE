// ========================================
// 활동 관리 관련 상수
// ========================================

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
