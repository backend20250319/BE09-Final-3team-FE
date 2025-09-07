/**
 * 일정 관련 유틸리티 함수들
 */

/**
 * 일정이 지났는지 확인하는 함수
 * @param {string} scheduleDate - 일정 날짜 (YYYY-MM-DD 형식)
 * @param {string} scheduleTime - 일정 시간 (HH:MM 형식, 선택사항)
 * @returns {boolean} - 일정이 지났으면 true, 아니면 false
 */
export const isSchedulePast = (scheduleDate, scheduleTime = null) => {
  if (!scheduleDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduleDateTime = new Date(scheduleDate);

  // 시간이 제공된 경우 시간도 고려
  if (scheduleTime) {
    const [hours, minutes] = scheduleTime.split(":").map(Number);
    scheduleDateTime.setHours(hours || 0, minutes || 0, 0, 0);
  } else {
    scheduleDateTime.setHours(0, 0, 0, 0);
  }

  return scheduleDateTime < today;
};

/**
 * 일정이 오늘인지 확인하는 함수
 * @param {string} scheduleDate - 일정 날짜 (YYYY-MM-DD 형식)
 * @returns {boolean} - 오늘 일정이면 true, 아니면 false
 */
export const isScheduleToday = (scheduleDate) => {
  if (!scheduleDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduleDateObj = new Date(scheduleDate);
  scheduleDateObj.setHours(0, 0, 0, 0);

  return scheduleDateObj.getTime() === today.getTime();
};

/**
 * 일정이 내일인지 확인하는 함수
 * @param {string} scheduleDate - 일정 날짜 (YYYY-MM-DD 형식)
 * @returns {boolean} - 내일 일정이면 true, 아니면 false
 */
export const isScheduleTomorrow = (scheduleDate) => {
  if (!scheduleDate) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const scheduleDateObj = new Date(scheduleDate);
  scheduleDateObj.setHours(0, 0, 0, 0);

  return scheduleDateObj.getTime() === tomorrow.getTime();
};

/**
 * 일정의 상태를 반환하는 함수
 * @param {string} scheduleDate - 일정 날짜 (YYYY-MM-DD 형식)
 * @param {string} scheduleTime - 일정 시간 (HH:MM 형식, 선택사항)
 * @returns {string} - 'past', 'today', 'tomorrow', 'future'
 */
export const getScheduleStatus = (scheduleDate, scheduleTime = null) => {
  if (isSchedulePast(scheduleDate, scheduleTime)) return "past";
  if (isScheduleToday(scheduleDate)) return "today";
  if (isScheduleTomorrow(scheduleDate)) return "tomorrow";
  return "future";
};

/**
 * 지난 일정을 필터링하는 함수
 * @param {Array} schedules - 일정 배열
 * @param {boolean} includePast - 지난 일정 포함 여부 (기본값: false)
 * @returns {Array} - 필터링된 일정 배열
 */
export const filterSchedules = (schedules, includePast = false) => {
  if (!Array.isArray(schedules)) return [];

  if (includePast) return schedules;

  return schedules.filter((schedule) => {
    const scheduleDate = schedule.startDate || schedule.date;
    const scheduleTime = schedule.scheduleTime || schedule.time;
    return !isSchedulePast(scheduleDate, scheduleTime);
  });
};
