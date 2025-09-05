"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/AddScheduleModal.module.css";

export default function CustomCalendar({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
  minDate,
  maxDate,
  buttonRef,
  monthlyMode = false, // 매월 모드 여부
  monthlyDay = null, // 매월 반복할 일 (예: 5일)
  weeklyMode = false, // 매주 모드 여부
  weeklyDayOfWeek = null, // 매주 반복할 요일 (0=일요일, 1=월요일, ...)
  showToday = true, // 오늘 날짜 표시 여부
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 달력에 표시할 날짜들 생성
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 이번 달 첫째 날
    const firstDay = new Date(year, month, 1);
    // 이번 달 마지막 날
    const lastDay = new Date(year, month + 1, 0);
    // 첫째 날의 요일 (0=일요일)
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // 이전 달의 마지막 날들
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }

    // 이번 달의 모든 날들
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    // 다음 달의 첫째 날들 (42개 셀을 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(date);
    }

    return days;
  };

  const days = generateCalendarDays();

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (date) => {
    // 매월 모드일 때는 특정 일만 선택 가능
    if (monthlyMode && monthlyDay !== null) {
      if (date.getDate() !== monthlyDay) {
        return; // 선택된 일이 아니면 무시
      }
    }

    // 매주 모드일 때는 특정 요일만 선택 가능
    if (weeklyMode && weeklyDayOfWeek !== null) {
      if (date.getDay() !== weeklyDayOfWeek) {
        return; // 선택된 요일이 아니면 무시
      }
    }

    // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 시간대 그대로 사용)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 달력 위치 계산 (오른쪽 아래)
  const getCalendarPosition = () => {
    if (buttonRef && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 8,
        left: rect.right - 280, // 달력 너비(280px)만큼 왼쪽으로 이동
        transform: "none",
      };
    }
    return {};
  };

  if (!isOpen) return null;

  return (
    <div className={styles.calendarOverlay}>
      <div
        className={styles.calendar}
        onClick={(e) => e.stopPropagation()}
        style={getCalendarPosition()}
      >
        <div className={styles.calendarHeader}>
          <button onClick={prevMonth} className={styles.calendarNavButton}>
            ‹
          </button>
          <span className={styles.calendarTitle}>
            {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
          </span>
          <button onClick={nextMonth} className={styles.calendarNavButton}>
            ›
          </button>
        </div>

        <div className={styles.calendarGrid}>
          <div className={styles.calendarWeekdays}>
            {weekdays.map((day) => (
              <div key={day} className={styles.calendarWeekday}>
                {day}
              </div>
            ))}
          </div>

          <div className={styles.calendarDays}>
            {days.map((date, index) => {
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth();
              const isSelected =
                selectedDate === date.toISOString().split("T")[0];
              const isToday = date.toDateString() === new Date().toDateString();

              // 최소/최대 날짜 제한
              const isDisabled =
                (minDate && date.toISOString().split("T")[0] < minDate) ||
                (maxDate && date.toISOString().split("T")[0] > maxDate);

              // 매월 모드일 때는 특정 일만 활성화
              const isMonthlyDay =
                monthlyMode &&
                monthlyDay !== null &&
                date.getDate() === monthlyDay;
              const isMonthlyDisabled =
                monthlyMode &&
                monthlyDay !== null &&
                date.getDate() !== monthlyDay;

              // 매주 모드일 때는 특정 요일만 활성화
              const isWeeklyDay =
                weeklyMode &&
                weeklyDayOfWeek !== null &&
                date.getDay() === weeklyDayOfWeek;
              const isWeeklyDisabled =
                weeklyMode &&
                weeklyDayOfWeek !== null &&
                date.getDay() !== weeklyDayOfWeek;

              return (
                <button
                  key={index}
                  className={`${styles.calendarDay} ${
                    !isCurrentMonth ? styles.otherMonth : ""
                  } ${isSelected ? styles.selected : ""} ${
                    isToday && showToday && !monthlyMode && !weeklyMode
                      ? styles.today
                      : ""
                  } ${isDisabled ? styles.disabled : ""} ${
                    isMonthlyDay ? styles.monthlyDay : ""
                  } ${isMonthlyDisabled ? styles.monthlyDisabled : ""} ${
                    isWeeklyDay ? styles.weeklyDay : ""
                  } ${isWeeklyDisabled ? styles.weeklyDisabled : ""}`}
                  onClick={() => handleDateClick(date)}
                  disabled={
                    !isCurrentMonth ||
                    isDisabled ||
                    isMonthlyDisabled ||
                    isWeeklyDisabled
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
