import React, { useState, useEffect } from "react";
import { useSelectedPet } from "../../context/SelectedPetContext";
import { getActivityRecordDates, getActivityRecord } from "../../data/mockData";
import ActivityRecordView from "./ActivityRecordView";
import Toast from "../../medical/components/Toast";
import styles from "../styles/MyCalendar.module.css";

const MyCalendar = () => {
  const { selectedPetName } = useSelectedPet();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordView, setShowRecordView] = useState(false);
  const [activityDates, setActivityDates] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (selectedPetName) {
      // 더미데이터와 실제 저장된 데이터를 모두 가져오기
      const dummyRecordDates = getActivityRecordDates(selectedPetName);
      const savedRecordDates = getSavedActivityDates(selectedPetName);

      // 중복 제거하여 합치기
      const allDates = [...new Set([...dummyRecordDates, ...savedRecordDates])];
      setActivityDates(allDates);
    }
  }, [selectedPetName]);

  // localStorage에서 실제 저장된 활동 기록 날짜들 가져오기
  const getSavedActivityDates = (petName) => {
    const dates = [];
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith(`${petName}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data && data.petName === petName) {
            // 키에서 날짜 추출 (예: "초코_2025-08-08" -> "2025-08-08")
            const datePart = key.replace(`${petName}_`, "");
            if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dates.push(datePart);
            }
          }
        } catch (error) {
          console.error("localStorage 데이터 파싱 오류:", error);
        }
      }
    });

    return dates;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hasActivity = (date) => {
    const dateStr = formatDate(date);
    return activityDates.includes(dateStr);
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);

    // 먼저 localStorage에서 실제 저장된 데이터 확인
    const storageKey = `${selectedPetName}_${dateStr}`;
    let record = null;

    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        record = JSON.parse(savedData);
      }
    } catch (error) {
      console.error("localStorage 데이터 파싱 오류:", error);
    }

    // 저장된 데이터가 없으면 더미데이터 확인
    if (!record) {
      record = getActivityRecord(selectedPetName, dateStr);
    }

    if (record) {
      setSelectedDate(dateStr);
      setSelectedRecord(record);
      setShowRecordView(true);
    } else {
      // 기록되지 않은 날짜에 대한 토스트 메시지
      const month = date.getMonth() + 1;
      const day = date.getDate();
      setToastMessage(`${month}월 ${day}일은 기록되지 않았습니다.`);
      setShowToast(true);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

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

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const days = getDaysInMonth(currentDate);

  // 프로필 이미지 매핑 (헤더용)
  const petImageMap = {
    몽글이: "/user/dog.png",
    초코: "/user/cat.png",
    차차: "/user/bird.png",
  };
  const headerAvatarSrc = petImageMap[selectedPetName] || "/user/dog.png";

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.titleRow}>
          <img
            src={headerAvatarSrc}
            alt={`${selectedPetName} 프로필`}
            className={styles.headerAvatar}
          />
          <h3 className={styles.calendarTitle}>
            {selectedPetName}의 활동 기록
          </h3>
        </div>
        <p className={styles.calendarSubtitle}>
          녹색으로 표시된 날짜를 클릭하면 해당 날짜의 활동 기록을 볼 수
          있습니다.
        </p>
      </div>

      <div className={styles.calendarWrapper}>
        <div className={styles.calendarControls}>
          <button onClick={goToPreviousMonth} className={styles.navButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 4L6 10L12 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className={styles.monthDisplay}>
            <span className={styles.monthYear}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>

          <button onClick={goToNextMonth} className={styles.navButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 4L14 10L8 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.calendarGrid}>
          {/* 요일 헤더 */}
          <div className={styles.weekHeader}>
            {dayNames.map((day, index) => (
              <div
                key={day}
                className={`${styles.dayHeader} ${
                  index === 0 ? styles.sunday : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className={styles.daysGrid}>
            {days.map((day, index) => {
              const isCurrentMonthDay = isCurrentMonth(day);
              const isTodayDate = isToday(day);
              const hasActivityOnDay = hasActivity(day);
              const dayFormatted = formatDate(day);

              return (
                <div
                  key={index}
                  className={`
                    ${styles.dayCell}
                    ${!isCurrentMonthDay ? styles.otherMonth : ""}
                    ${isTodayDate ? styles.today : ""}
                    ${hasActivityOnDay ? styles.hasActivity : ""}
                    ${styles.clickable}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <span className={styles.dayNumber}>{day.getDate()}</span>
                  {hasActivityOnDay && (
                    <div className={styles.activityIndicator}>
                      <div className={styles.activityDot}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ActivityRecordView
        isOpen={showRecordView}
        onClose={() => setShowRecordView(false)}
        recordData={selectedRecord}
        date={selectedDate}
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type="inactive"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default MyCalendar;
