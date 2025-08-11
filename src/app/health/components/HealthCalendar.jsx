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
}) {
  const [currentDate, setCurrentDate] = useState(defaultDate);
  const [currentView] = useState(defaultView);
  const [showMoreEvents, setShowMoreEvents] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    medication: true,
    care: true,
    vaccination: true,
    checkup: true,
    etc: true,
  });

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventType = event.type || "etc";
      return activeFilters[eventType];
    });
  }, [events, activeFilters]);

  // 필터 토글 함수
  const toggleFilter = (filterType) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
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
      {Object.entries(EVENT_TYPE_COLORS).map(([key, color]) => (
        <div key={key} className={styles.legendItem}>
          <button
            className={`${styles.filterButton} ${
              activeFilters[key] ? styles.activeFilter : styles.inactiveFilter
            }`}
            onClick={() => toggleFilter(key)}
            title={`${
              key === "medication"
                ? "투약"
                : key === "care"
                ? "돌봄"
                : key === "vaccination"
                ? "접종"
                : key === "checkup"
                ? "건강검진"
                : "기타"
            } 필터`}
          >
            <span
              className={styles.legendDot}
              style={{ backgroundColor: color }}
            />
            <span className={styles.legendLabel}>
              {key === "medication"
                ? "투약"
                : key === "care"
                ? "돌봄"
                : key === "vaccination"
                ? "접종"
                : key === "checkup"
                ? "건강검진"
                : "기타"}
            </span>
          </button>
        </div>
      ))}
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
