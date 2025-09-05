"use client";

import React, { useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ko from "date-fns/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/HealthCalendar.module.css";

export const EVENT_TYPE_COLORS = {
  medication: "#C8E6C9",
  care: "#BBDEFB",
  vaccination: "#E1BEE7",
  checkup: "#FFE0B2",
  etc: "#E0E0E0",
  // 투약 유형별 색상
  복용약: "#90CAF9", // 더 선명한 블루톤
  영양제: "#FFE082", // 더 선명한 앰버톤
  // 돌봄 유형별 색상
  산책: "#81C784", // 더 선명한 그린톤
  미용: "#CE93D8", // 더 선명한 퍼플톤
  생일: "#F48FB1", // 더 선명한 핑크톤
  기타: "#BDBDBD", // 회색톤
  // 접종 유형별 색상
  예방접종: "#E1BEE7",
  건강검진: "#FFB74D", // 더 선명한 오렌지톤
};

const locales = { ko };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function HealthCalendar({
  events = [],
  defaultView = "month",
  defaultDate = new Date(),
  onSelectEvent,
  onSelectSlot,
  views = ["month"],
  showLegend = true,
  onEventClick,
  activeTab = "투약", // 현재 활성 탭 추가
}) {
  // 캘린더 디버깅
  console.log("🔍 HealthCalendar 렌더링됨");
  console.log("🔍 받은 events:", events);
  console.log("🔍 events 개수:", events.length);
  console.log("🔍 activeTab:", activeTab);
  console.log(
    "🔍 events 상세:",
    events.map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      type: e.type,
      schedule: e.schedule,
    }))
  );

  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [currentView] = useState(defaultView);
  const [showMoreEvents, setShowMoreEvents] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    medication: true,
    care: true,
    vaccination: true,
    checkup: true,
    etc: true,
    복용약: true,
    영양제: true,
    산책: true,
    미용: true,
    생일: true,
    기타: true,
    예방접종: true,
    건강검진: true,
  });

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventType = event.type || "etc";

      // 투약 탭: 복용약/영양제만, 그리고 해당 필터가 활성화된 경우만 표시
      if (activeTab === "투약") {
        const isMedicationType =
          eventType === "복용약" || eventType === "영양제";
        return isMedicationType && !!activeFilters[eventType];
      }

      // 돌봄 탭: 산책/미용/생일/기타/예방접종/건강검진만, 그리고 해당 필터가 활성화된 경우만 표시
      if (activeTab === "돌봄") {
        const isCareType =
          eventType === "산책" ||
          eventType === "미용" ||
          eventType === "생일" ||
          eventType === "기타" ||
          eventType === "예방접종" ||
          eventType === "건강검진";
        return isCareType && !!activeFilters[eventType];
      }

      return !!activeFilters[eventType];
    });
  }, [events, activeFilters, activeTab]);

  // 필터링된 이벤트 디버깅
  console.log("🔍 필터링된 이벤트:", filteredEvents);
  console.log("🔍 필터링된 이벤트 개수:", filteredEvents.length);
  console.log("🔍 활성 필터:", activeFilters);

  // 필터 토글 함수
  const toggleFilter = (filterType) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  // 전체 필터 토글 함수
  const toggleAllFilters = () => {
    if (activeTab === "투약") {
      // 투약 탭에서는 복용약과 영양제만 토글
      const allActive = activeFilters.복용약 && activeFilters.영양제;
      setActiveFilters((prev) => ({
        ...prev,
        복용약: !allActive,
        영양제: !allActive,
      }));
    } else if (activeTab === "돌봄") {
      // 돌봄 탭에서는 돌봄과 접종 관련 필터만 토글
      const allActive =
        activeFilters.산책 &&
        activeFilters.미용 &&
        activeFilters.생일 &&
        activeFilters.기타 &&
        activeFilters.예방접종 &&
        activeFilters.건강검진;
      setActiveFilters((prev) => ({
        ...prev,
        산책: !allActive,
        미용: !allActive,
        생일: !allActive,
        기타: !allActive,
        예방접종: !allActive,
        건강검진: !allActive,
      }));
    } else {
      // 기본 전체 토글
      const allActive = Object.values(activeFilters).every(Boolean);
      setActiveFilters((prev) => {
        const newFilters = {};
        Object.keys(prev).forEach((key) => {
          newFilters[key] = !allActive;
        });
        return newFilters;
      });
    }
  };

  // rbc 이벤트 스타일 지정
  const eventPropGetter = useMemo(() => {
    return (event) => {
      const colorKey =
        event.type && EVENT_TYPE_COLORS[event.type] ? event.type : "etc";
      const backgroundColor = EVENT_TYPE_COLORS[colorKey];

      return {
        style: {
          backgroundColor,
          borderColor: backgroundColor,
          color: "#594A3E",
          borderRadius: 6,
          padding: "2px 6px",
          fontSize: 12,
        },
      };
    };
  }, []);

  const messages = useMemo(
    () => ({
      date: "날짜",
      time: "시간",
      event: "이벤트",
      allDay: "하루종일",
      week: "주",
      work_week: "업무주",
      day: "일",
      month: "월",
      previous: "이전",
      next: "다음",
      yesterday: "어제",
      tomorrow: "내일",
      today: "오늘",
      agenda: "리스트",
      noEventsInRange: "일정이 없습니다.",
      showMore: (total) => `+ 일정 ${total}개`,
    }),
    []
  );

  const formats = useMemo(
    () => ({
      dayFormat: (date) => format(date, "d(EEE)", { locale: ko }),
      weekdayFormat: (date) => format(date, "EEE", { locale: ko }),
      monthHeaderFormat: (date) => format(date, "yyyy년 M월", { locale: ko }),
      dayHeaderFormat: (date) =>
        format(date, "yyyy년 M월 d일 EEE", { locale: ko }),
      agendaHeaderFormat: ({ start, end }) =>
        `${format(start, "yyyy.MM.dd", { locale: ko })} - ${format(
          end,
          "yyyy.MM.dd",
          { locale: ko }
        )}`,
      eventTimeRangeFormat: ({ start /*, end*/ }) => format(start, "HH:mm"),
    }),
    []
  );

  // 커스텀 툴바 (년/월 선택 + 이전/다음 + 중앙 라벨)
  function Toolbar(toolbarProps) {
    const { onNavigate } = toolbarProps;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => i);

    const handleYearChange = (e) => {
      const newYear = parseInt(e.target.value);
      const newDate = new Date(newYear, currentMonth, 1);
      setCurrentDate(newDate);
      onNavigate("DATE", newDate);
    };

    const handleMonthChange = (e) => {
      const newMonth = parseInt(e.target.value);
      const newDate = new Date(currentYear, newMonth, 1);
      setCurrentDate(newDate);
      onNavigate("DATE", newDate);
    };

    return (
      <div className={styles.toolbar}>
        <div className={styles.dateSelectors}>
          <select
            value={currentYear}
            onChange={handleYearChange}
            className={styles.yearSelect}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}년
              </option>
            ))}
          </select>
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className={styles.monthSelect}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month + 1}월
              </option>
            ))}
          </select>
        </div>
        <div className={styles.centerLabel}>
          {format(currentDate, "yyyy년 M월", { locale: ko })}
        </div>
        <div className={styles.navButtons}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="이전"
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth - 1, 1);
              setCurrentDate(newDate);
              onNavigate("DATE", newDate);
            }}
          >
            <img src="/user/left.svg" alt="이전" width="16" height="16" />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="다음"
            onClick={() => {
              const newDate = new Date(currentYear, currentMonth + 1, 1);
              setCurrentDate(newDate);
              onNavigate("DATE", newDate);
            }}
          >
            <img src="/user/right.svg" alt="다음" width="16" height="16" />
          </button>
        </div>
      </div>
    );
  }

  // 월 셀 이벤트 커스텀 렌더링 (시간 + 타이틀)
  const EventItem = ({ event }) => {
    const time = format(event.start, "HH:mm");
    return (
      <div className={styles.eventItem} title={event.title}>
        <span className={styles.eventTime}>{time}</span>
        <span className={styles.eventTitle}>{event.title}</span>
      </div>
    );
  };

  // + 일정 n개 클릭 시 드롭다운 표시
  const handleShowMoreClick = (events, date, slotInfo) => {
    setShowMoreEvents({ events, date, slotInfo });
  };

  // 드롭다운 닫기
  const handleCloseShowMore = () => {
    setShowMoreEvents(null);
  };

  const legend = (
    <div className={styles.legend}>
      {/* 전체 필터 버튼 */}
      <div className={styles.legendItem}>
        <button
          className={`${styles.filterButton} ${
            (activeTab === "투약" &&
              activeFilters.복용약 &&
              activeFilters.영양제) ||
            (activeTab === "돌봄" &&
              activeFilters.산책 &&
              activeFilters.미용 &&
              activeFilters.생일 &&
              activeFilters.기타 &&
              activeFilters.예방접종 &&
              activeFilters.건강검진)
              ? styles.activeFilter
              : styles.inactiveFilter
          }`}
          onClick={toggleAllFilters}
          title="전체 필터"
        >
          <span className={styles.legendLabel}>전체</span>
        </button>
      </div>

      {/* 투약 탭 필터 */}
      {activeTab === "투약" && (
        <>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.복용약
                  ? styles.activeFilter
                  : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("복용약")}
              title="복용약 필터"
            >
              <span
                className={styles.legendDot}
                style={{
                  backgroundColor: EVENT_TYPE_COLORS.복용약 || "#E3F2FD",
                }}
              />
              <span className={styles.legendLabel}>복용약</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.영양제
                  ? styles.activeFilter
                  : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("영양제")}
              title="영양제 필터"
            >
              <span
                className={styles.legendDot}
                style={{
                  backgroundColor: EVENT_TYPE_COLORS.영양제 || "#FFF3E0",
                }}
              />
              <span className={styles.legendLabel}>영양제</span>
            </button>
          </div>
        </>
      )}

      {/* 돌봄 탭 필터 */}
      {activeTab === "돌봄" && (
        <>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.산책 ? styles.activeFilter : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("산책")}
              title="산책 필터"
            >
              <span
                className={styles.legendDot}
                style={{ backgroundColor: EVENT_TYPE_COLORS.산책 || "#E8F5E8" }}
              />
              <span className={styles.legendLabel}>산책</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.미용 ? styles.activeFilter : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("미용")}
              title="미용 필터"
            >
              <span
                className={styles.legendDot}
                style={{ backgroundColor: EVENT_TYPE_COLORS.미용 || "#FFF3E0" }}
              />
              <span className={styles.legendLabel}>미용</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.생일 ? styles.activeFilter : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("생일")}
              title="생일 필터"
            >
              <span
                className={styles.legendDot}
                style={{ backgroundColor: EVENT_TYPE_COLORS.생일 || "#FCE4EC" }}
              />
              <span className={styles.legendLabel}>생일</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.기타 ? styles.activeFilter : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("기타")}
              title="기타 필터"
            >
              <span
                className={styles.legendDot}
                style={{ backgroundColor: EVENT_TYPE_COLORS.기타 || "#BDBDBD" }}
              />
              <span className={styles.legendLabel}>기타</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.예방접종
                  ? styles.activeFilter
                  : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("예방접종")}
              title="예방접종 필터"
            >
              <span
                className={styles.legendDot}
                style={{
                  backgroundColor: EVENT_TYPE_COLORS.예방접종 || "#E1BEE7",
                }}
              />
              <span className={styles.legendLabel}>예방접종</span>
            </button>
          </div>
          <div className={styles.legendItem}>
            <button
              className={`${styles.filterButton} ${
                activeFilters.건강검진
                  ? styles.activeFilter
                  : styles.inactiveFilter
              }`}
              onClick={() => toggleFilter("건강검진")}
              title="건강검진 필터"
            >
              <span
                className={styles.legendDot}
                style={{
                  backgroundColor: EVENT_TYPE_COLORS.건강검진 || "#FFE0B2",
                }}
              />
              <span className={styles.legendLabel}>건강검진</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className={styles.calendarWrap}>
      {showLegend && legend}
      <BigCalendar
        culture="ko"
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        view={currentView}
        date={currentDate}
        views={views}
        messages={messages}
        formats={formats}
        selectable
        onSelectSlot={onSelectSlot}
        onSelectEvent={(event) => {
          if (onEventClick) {
            onEventClick(event);
          } else if (onSelectEvent) {
            onSelectEvent(event);
          }
        }}
        eventPropGetter={eventPropGetter}
        popup
        style={{ height: "800px", width: "1228px" }}
        className={styles.calendar}
        components={{ toolbar: Toolbar, event: EventItem }}
        showMultiDayTimes
        onShowMore={(events, date, slotInfo) =>
          handleShowMoreClick(events, date, slotInfo)
        }
      />

      {/* + 일정 n개 드롭다운 */}
      {showMoreEvents && (
        <div className={styles.showMoreOverlay} onClick={handleCloseShowMore}>
          <div
            className={styles.showMoreModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.showMoreHeader}>
              <h3>
                {format(showMoreEvents.date, "M월 d일", { locale: ko })} 일정
              </h3>
              <button
                onClick={handleCloseShowMore}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.showMoreEvents}>
              {showMoreEvents.events.map((event, index) => (
                <div
                  key={index}
                  className={styles.showMoreEventItem}
                  onClick={() => {
                    if (onEventClick) {
                      onEventClick(event);
                    }
                    handleCloseShowMore();
                  }}
                >
                  <div
                    className={styles.eventTypeIndicator}
                    style={{
                      backgroundColor:
                        EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.etc,
                    }}
                  />
                  <div className={styles.eventInfo}>
                    <div className={styles.eventTime}>
                      {format(event.start, "HH:mm")}
                    </div>
                    <div className={styles.eventTitle}>{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
