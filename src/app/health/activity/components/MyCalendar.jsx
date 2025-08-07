import React from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "오늘 산책 완료",
    start: new Date(),
    end: new Date(),
  },
];

// 이름을 Calendar에서 MyCalendar로 바꿈
const MyCalendar = () => {
  return (
    <div style={{ height: "500px", margin: "20px" }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={(slotInfo) => {
          alert(`날짜 선택됨: ${slotInfo.start.toLocaleDateString()}`);
        }}
        onSelectEvent={(event) => {
          alert(`${event.title} 클릭됨`);
        }}
      />
    </div>
  );
};

export default MyCalendar;
