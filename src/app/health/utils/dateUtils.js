// ========================================
// 날짜 관련 유틸리티 함수들
// ========================================

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

// 특정 날짜와 "HH:MM" 문자열로 Date 만들기
export const createDateAtTime = (baseDate, hm) => {
  const [hh = 9, mm = 0] = (hm || "09:00")
    .split(":")
    .map((n) => parseInt(n.trim(), 10));
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hh,
    mm,
    0,
    0
  );
};

// 날짜 문자열을 Date 객체로 변환
export const parseDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString);
};

// 두 날짜 사이의 일수 계산
export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
};

// 오늘 날짜인지 확인
export const isToday = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  
  return (
    today.getFullYear() === targetDate.getFullYear() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getDate() === targetDate.getDate()
  );
};

// 과거 날짜인지 확인
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return targetDate < today;
};

// 미래 날짜인지 확인
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return targetDate > today;
};

// 날짜 범위 검증
export const isDateInRange = (date, startDate, endDate) => {
  const targetDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return targetDate >= start && targetDate <= end;
};

// 최소 종료날짜 계산
export const getMinEndDate = (startDate, frequency) => {
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
};

// 날짜에 일수 추가
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// 날짜에 주수 추가
export const addWeeks = (date, weeks) => {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
};

// 날짜에 월수 추가
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// 날짜 비교 함수들
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isSameWeek = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  const startOfWeek1 = new Date(d1);
  startOfWeek1.setDate(d1.getDate() - d1.getDay());
  
  const startOfWeek2 = new Date(d2);
  startOfWeek2.setDate(d2.getDate() - d2.getDay());
  
  return isSameDay(startOfWeek1, startOfWeek2);
};

export const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth()
  );
};

// 요일 이름 가져오기
export const getDayName = (date, locale = "ko-KR") => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, { weekday: "long" });
};

// 월 이름 가져오기
export const getMonthName = (date, locale = "ko-KR") => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, { month: "long" });
};
