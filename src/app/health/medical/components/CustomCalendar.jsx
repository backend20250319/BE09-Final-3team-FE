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
    // 한국 시간대로 변환 (UTC +9시간)
    const koreanDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const formattedDate = koreanDate.toISOString().split("T")[0];
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

              return (
                <button
                  key={index}
                  className={`${styles.calendarDay} ${
                    !isCurrentMonth ? styles.otherMonth : ""
                  } ${isSelected ? styles.selected : ""} ${
                    isToday ? styles.today : ""
                  } ${isDisabled ? styles.disabled : ""}`}
                  onClick={() => handleDateClick(date)}
                  disabled={!isCurrentMonth || isDisabled}
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
