import React, { useState, useEffect, useCallback } from "react";
import { useSelectedPet } from "../../context/SelectedPetContext";

import {
  getActivityData,
  getActivityDataByPeriod,
} from "../../../../api/activityApi";
import ActivityRecordView from "./ActivityRecordView";
import Toast from "../../medical/components/Toast";
import styles from "../styles/MyCalendar.module.css";

const MyCalendar = () => {
  const { selectedPetName, selectedPetNo, pets } = useSelectedPet();
  const [currentDate, setCurrentDate] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트에서만 날짜 초기화
  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date());
  }, []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordView, setShowRecordView] = useState(false);
  const [activityDates, setActivityDates] = useState([]);

  // activityDates 상태 변경 추적
  useEffect(() => {
    console.log("activityDates 상태 변경:", activityDates);
  }, [activityDates]);

  // 컴포넌트 마운트 시 강제 호출 제거 (정상 작동하므로 불필요)
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // 펫이 변경되거나 월이 변경될 때만 활동 날짜 가져오기
  useEffect(() => {
    if (!isClient || !currentDate) return;

    console.log("useEffect 실행:", {
      selectedPetName,
      selectedPetNo,
      currentDate: currentDate.getTime(),
    });
    if (selectedPetName && selectedPetNo) {
      console.log("fetchActivityDates 호출");
      fetchActivityDates();
    } else {
      console.log("펫이 선택되지 않음, fetchActivityDates 호출 안함");
    }
  }, [
    selectedPetName,
    selectedPetNo,
    currentDate?.getFullYear(),
    currentDate?.getMonth(),
    isClient,
  ]);

  // 백엔드에서 활동 기록 날짜들 가져오기
  const fetchActivityDates = useCallback(async () => {
    if (!isClient || !currentDate) return;

    try {
      console.log("=== fetchActivityDates 시작 ===");
      console.log("fetchActivityDates 실행:", { selectedPetNo, currentDate });
      console.log("currentDate 타입:", typeof currentDate);
      console.log("currentDate 값:", currentDate);

      // 현재 월의 시작과 끝 날짜 계산
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0부터 시작 (0=1월, 1=2월, ..., 7=8월)

      // 8월이면 month=7, 실제 월은 8
      const actualMonth = month + 1;

      // 해당 월의 첫째 날과 마지막 날 계산 (더 안전한 방법)
      const firstDay = new Date(year, month, 1);

      // 다음 달의 첫째 날에서 하루를 빼서 현재 달의 마지막 날 계산
      const nextMonthFirstDay = new Date(year, month + 1, 1);
      const lastDay = new Date(
        nextMonthFirstDay.getTime() - 24 * 60 * 60 * 1000
      );

      // 날짜 객체를 YYYY-MM-DD 형식으로 변환 (한국 시간대 명시적 처리)
      // Intl.DateTimeFormat을 사용하여 한국 시간대로 정확한 날짜 계산
      const kstFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const startDate = kstFormatter.format(firstDay);
      const endDate = kstFormatter.format(lastDay);

      // 디버깅을 위한 추가 검증
      console.log("날짜 객체 검증:", {
        firstDay: firstDay.toDateString(),
        lastDay: lastDay.toDateString(),
        firstDayISO: firstDay.toISOString(),
        lastDayISO: lastDay.toISOString(),
        startDate,
        endDate,
      });

      console.log("계산된 날짜:", {
        year,
        month,
        actualMonth,
        firstDay: firstDay.toDateString(),
        lastDay: lastDay.toDateString(),
        startDate,
        endDate,
      });

      // 날짜 계산 과정 요약
      console.log("날짜 계산 요약:", {
        year,
        month,
        actualMonth,
        startDate,
        endDate,
      });

      if (!selectedPetNo) {
        console.log("selectedPetNo가 없음, 함수 종료");
        return;
      }

      console.log("백엔드 API 호출 시작");
      console.log("API 호출 파라미터:", { startDate, endDate, selectedPetNo });

      // 백엔드에서 해당 월의 활동 스케줄 조회
      const activityData = await getActivityDataByPeriod(
        startDate,
        endDate,
        selectedPetNo
      );

      console.log("활동 날짜 데이터:", activityData);
      console.log("활동 날짜 데이터 타입:", typeof activityData);
      console.log("활동 날짜 데이터가 배열인가?", Array.isArray(activityData));

      if (activityData && Array.isArray(activityData)) {
        // 백엔드에서 날짜 문자열 배열로 반환
        console.log("활동 날짜 설정:", activityData);
        setActivityDates(activityData);
      } else {
        console.log("백엔드에 데이터가 없음");
        setActivityDates([]);
      }
    } catch (error) {
      console.error("활동 날짜 조회 실패:", error);
      setActivityDates([]);
    }
  }, [
    selectedPetNo,
    currentDate?.getFullYear(),
    currentDate?.getMonth(),
    isClient,
  ]);

  // 저장 완료 메시지 수신 시 활동 날짜 다시 가져오기
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "ACTIVITY_SAVED") {
        console.log("활동 저장 완료 메시지 수신, 활동 날짜 다시 가져오기");
        // 약간의 지연 후 활동 날짜 다시 가져오기
        setTimeout(() => {
          fetchActivityDates();
        }, 500);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchActivityDates]);

  const getDaysInMonth = (date) => {
    if (!date) return [];

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
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    if (!date) return false;

    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    if (!date || !currentDate) return false;

    return date.getMonth() === currentDate.getMonth();
  };

  const hasActivity = (date) => {
    if (!date) return false;

    const dateStr = formatDate(date);
    const hasActivityResult = activityDates.includes(dateStr);

    // 디버깅을 위한 로그 (너무 많이 출력되지 않도록 조건부로)
    if (date.getDate() === 1 || date.getDate() === 15) {
      console.log(
        `hasActivity 체크 - 날짜: ${dateStr}, 결과: ${hasActivityResult}, activityDates:`,
        activityDates
      );
    }

    return hasActivityResult;
  };

  const handleDateClick = async (date) => {
    const dateStr = formatDate(date);
    console.log("날짜 클릭:", {
      dateStr,
      selectedPetNo,
      selectedDate,
      showRecordView,
    });

    try {
      if (!selectedPetNo) return;

      // 항상 새로운 날짜를 선택하도록 selectedDate 업데이트
      setSelectedDate(dateStr);

      // 백엔드에서 해당 날짜의 활동 데이터 조회
      console.log("getActivityData 호출:", { dateStr, selectedPetNo });
      const record = await getActivityData(dateStr, selectedPetNo);
      console.log("getActivityData 응답:", record);

      if (record && record.activityNo) {
        console.log("활동 데이터 설정:", record);
        setSelectedRecord(record);
        setShowRecordView(true);
      } else {
        console.log("활동 데이터 없음:", dateStr);
        setSelectedRecord(null);
        setShowRecordView(false);

        // 백엔드 오류인지 실제 데이터 없는지 구분
        if (record && record.code === "9000") {
          setToastMessage(
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          );
        } else {
          setToastMessage("해당 날짜에 활동 기록이 없습니다.");
        }
        setShowToast(true);
      }
    } catch (error) {
      console.error("활동 데이터 조회 실패:", error);
      setSelectedRecord(null);
      setShowRecordView(false);

      // 네트워크 오류인지 구분
      if (error.response && error.response.status === 500) {
        setToastMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setToastMessage("활동 데이터 조회 중 오류가 발생했습니다.");
      }
      setShowToast(true);
    }
  };

  const goToPreviousMonth = () => {
    if (!currentDate) return;

    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    if (!currentDate) return;

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

  const days = currentDate ? getDaysInMonth(currentDate) : [];

  // 선택된 펫의 정보 가져오기
  const selectedPet = pets.find((pet) => pet.name === selectedPetName);

  // 펫이 선택되지 않았을 때 메시지 표시
  if (!isClient) {
    return (
      <div className={styles.noPetContainer}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!selectedPetName || !selectedPetNo) {
    return (
      <div className={styles.calendarContainer}>
        <div className={styles.noPetSection}>
          <div className={styles.noPetArea}>
            <div className={styles.noPetIcon}>🐕</div>
            <div className={styles.noPetText}>
              <h3>반려동물을 선택해주세요</h3>
              <p>캘린더를 보려면 먼저 반려동물을 선택해주세요!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.calendarContainer} suppressHydrationWarning>
      <div className={styles.calendarHeader}>
        <div className={styles.titleRow}>
          {selectedPet?.imageUrl ? (
            <img
              src={selectedPet.imageUrl}
              alt={`${selectedPetName} 프로필`}
              className={styles.headerAvatar}
            />
          ) : (
            <div className={styles.petAvatarPlaceholder}>
              <span>?</span>
            </div>
          )}
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
              {currentDate
                ? `${
                    monthNames[currentDate.getMonth()]
                  } ${currentDate.getFullYear()}`
                : "로딩 중..."}
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
        selectedPetName={selectedPetName}
        onUpdate={() => {
          // 활동 데이터 수정 후 캘린더 새로고침
          if (selectedPetNo) {
            fetchActivityDates();
          }
        }}
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
