"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/DateRangeCalendar.module.css";
import Toast from "../../medical/components/Toast";

export default function DateRangeCalendar({
  isOpen,
  onClose,
  onDateRangeSelect,
  startDate,
  endDate,
  buttonRef,
  maxDays = 7, // 최대 선택 가능한 일수
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarPosition, setCalendarPosition] = useState({});
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [toast, setToast] = useState(null);

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

    // 이전 달의 마지막 날들 (빈 칸 채우기)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - i - 1);
      days.push({
        date: new Date(prevDate),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isDisabled: false,
      });
    }

    // 이번 달의 모든 날들
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      const isToday = date.getTime() === today.getTime();
      const isFuture = date > today;

      // 선택된 날짜 확인
      const isStartDate =
        tempStartDate &&
        date.toDateString() === new Date(tempStartDate).toDateString();
      const isEndDate =
        tempEndDate &&
        date.toDateString() === new Date(tempEndDate).toDateString();
      const isSelected = isStartDate || isEndDate;

      // 범위 내 날짜 확인 (최대 7일 제한)
      let isInRange = false;
      let isDisabled = isFuture; // 기본적으로 미래 날짜는 비활성화

      if (tempStartDate && tempEndDate) {
        // 시작일과 종료일이 모두 선택된 경우
        const start = new Date(tempStartDate);
        const end = new Date(tempEndDate);
        isInRange = date > start && date < end;
      } else if (tempStartDate && isSelectingEnd) {
        // 시작일만 선택된 경우 - 최대 7일 범위 내에서만 활성화
        const start = new Date(tempStartDate);
        const daysDiff = Math.ceil((date - start) / (1000 * 60 * 60 * 24)) + 1;

        if (date > start && daysDiff <= maxDays) {
          isInRange = true;
        } else if (date > start && daysDiff > maxDays) {
          // 7일을 초과하는 날짜는 비활성화
          isDisabled = true;
        }
      }

      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        isToday,
        isSelected,
        isInRange,
        isDisabled,
      });
    }

    // 다음 달의 첫째 날들 (빈 칸 채우기)
    const remainingDays = 42 - days.length; // 6주 * 7일 = 42
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(nextDate.getDate() + day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isDisabled: false,
      });
    }

    return days;
  };

  // 달력 위치 계산 - 화면 중앙에 고정
  const updateCalendarPosition = () => {
    setCalendarPosition({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    });
  };

  // 달력이 열릴 때 위치 업데이트
  useEffect(() => {
    if (isOpen) {
      updateCalendarPosition();
    }
  }, [isOpen]);

  // 달력이 열릴 때 초기 상태 설정
  useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setIsSelectingEnd(false);
    }
  }, [isOpen, startDate, endDate]);

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
    // 미래 날짜는 선택할 수 없음
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return;
    }

    // 한국 시간대 기준으로 날짜 문자열 생성
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (!tempStartDate) {
      // 시작일 선택
      setTempStartDate(dateString);
      setTempEndDate(null);
      setIsSelectingEnd(true);
    } else if (!tempEndDate) {
      // 종료일 선택
      const startDateObj = new Date(tempStartDate);

      if (selectedDate < startDateObj) {
        // 선택한 날짜가 시작일보다 이전이면 시작일로 설정
        setTempStartDate(dateString);
        setTempEndDate(null);
        setIsSelectingEnd(true);
      } else {
        // 최대 일수 확인
        const daysDiff =
          Math.ceil((selectedDate - startDateObj) / (1000 * 60 * 60 * 24)) + 1;
        if (daysDiff > maxDays) {
          setToast({
            message: `최대 ${maxDays}일까지 선택 가능합니다.`,
            type: "delete",
          });
          return;
        }

        setTempEndDate(dateString);
        setIsSelectingEnd(false);
      }
    } else {
      // 이미 시작일과 종료일이 모두 선택된 경우, 새로운 시작일로 설정
      setTempStartDate(dateString);
      setTempEndDate(null);
      setIsSelectingEnd(true);
    }
  };

  const handleConfirm = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeSelect(tempStartDate, tempEndDate);
      onClose();
    }
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setIsSelectingEnd(false);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    // YYYY-MM-DD 형식의 문자열을 파싱하여 한국 시간대 기준으로 표시
    const [year, month, day] = dateString.split("-");
    return `${year}.${month}.${day}`;
  };

  if (!isOpen) return null;

  const calendarDays = generateCalendarDays();

  return (
    <div className={styles.calendarOverlay} onClick={onClose}>
      <div
        className={styles.calendar}
        style={calendarPosition}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 달력 헤더 */}
        <div className={styles.calendarHeader}>
          <button
            type="button"
            className={styles.navButton}
            onClick={prevMonth}
            aria-label="이전 달"
          >
            ‹
          </button>
          <h3 className={styles.monthYear}>
            {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
          </h3>
          <button
            type="button"
            className={styles.navButton}
            onClick={nextMonth}
            aria-label="다음 달"
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className={styles.weekdays}>
          {weekdays.map((day) => (
            <div key={day} className={styles.weekday}>
              {day}
            </div>
          ))}
        </div>

        {/* 달력 그리드 */}
        <div className={styles.calendarGrid}>
          {calendarDays.map((day, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dayButton} ${
                !day.isCurrentMonth ? styles.otherMonth : ""
              } ${day.isToday ? styles.today : ""} ${
                day.isSelected ? styles.selected : ""
              } ${day.isInRange ? styles.inRange : ""} ${
                day.isDisabled ? styles.disabled : ""
              }`}
              onClick={() => handleDateClick(day.date)}
              disabled={day.isDisabled}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>

        {/* 선택된 날짜 표시 */}
        <div className={styles.selectedDates}>
          <div className={styles.dateInfo}>
            <span className={styles.dateLabel}>시작일:</span>
            <span className={styles.dateValue}>
              {tempStartDate
                ? formatDateForDisplay(tempStartDate)
                : "선택 안함"}
            </span>
          </div>
          <div className={styles.dateInfo}>
            <span className={styles.dateLabel}>종료일:</span>
            <span className={styles.dateValue}>
              {tempEndDate ? formatDateForDisplay(tempEndDate) : "선택 안함"}
            </span>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className={styles.infoText}>최대 7일까지 조회가 가능합니다.</div>

        {/* 버튼들 */}
        <div className={styles.calendarActions}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            초기화
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={!tempStartDate || !tempEndDate}
          >
            확인
          </button>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
