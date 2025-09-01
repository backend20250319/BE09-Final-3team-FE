"use client";

import React, { useState, useEffect, useCallback } from "react";
import PetProfileSelector from "./components/PetProfileSelector";
import { useSelectedPet } from "./context/SelectedPetContext";
import ActivityForm from "./activity/components/ActivityManagement";
import ActivityNavTabs from "./activity/components/ActivityNavTabs";
import ActivityReport from "./activity/components/ActivityReport";
import MedicalNavTabs from "./medical/components/MedicalNavTabs";
import MedicationManagement from "./medical/components/MedicationManagement";
import CareManagement from "./medical/components/CareManagement";

export default function HealthPage() {
  const { selectedPetName, setSelectedPetName, pets, loading } =
    useSelectedPet();

  const [activeMainTab, setActiveMainTab] = useState("활동 관리");
  const [activeSubTab, setActiveSubTab] = useState("활동 기록");
  const [medicalSubTab, setMedicalSubTab] = useState("투약");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [medicalCalendarEvents, setMedicalCalendarEvents] = useState([]);

  // 캘린더 이벤트 클릭 시 모달 관련 상태
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // 통합된 캘린더 이벤트 상태
  const [allCalendarEvents, setAllCalendarEvents] = useState([]);

  // 통합된 데이터 상태 (모든 컴포넌트에서 공유)
  const [medications, setMedications] = useState([]);
  const [careSchedules, setCareSchedules] = useState([]);
  const [vaccinationSchedules, setVaccinationSchedules] = useState([]);

  // 특정 날짜와 "HH:MM" 문자열로 Date 만들기
  const dateAtTime = useCallback((baseDate, hm) => {
    const [hh = 9, mm = 0] = (hm || "09:00")
      .split(":")
      .map((n) => parseInt(n.trim(), 10));
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hh,
      mm,
      0
    );
  }, []);

  // 통합된 캘린더 이벤트 구성 (투약 + 돌봄 + 접종 모두 포함)
  const buildAllCalendarEvents = useCallback(() => {
    const events = [];

    // 1) 투약: 기간 동안 매일, scheduleTime(콤마 구분) 각각 이벤트 생성
    medications.forEach((med) => {
      if (med.startDate && med.endDate) {
        const start = new Date(med.startDate);
        const end = new Date(med.endDate);
        const times = (med.scheduleTime || "09:00")
          .split(",")
          .map((t) => t.trim());
        const current = new Date(start);
        while (current <= end) {
          times.forEach((hm) => {
            const s = dateAtTime(current, hm);
            const e = new Date(s.getTime() + 60 * 60 * 1000);
            events.push({
              id: `med-${med.id}-${current.toISOString().slice(0, 10)}-${hm}`,
              title: `${med.icon || "💊"} ${med.name}`,
              start: s,
              end: e,
              allDay: false,
              type: med.type || "medication", // 유형별 색상을 위해 type 설정
              schedule: {
                ...med,
                category: "medication",
                type: med.type || "medication",
              },
            });
          });
          current.setDate(current.getDate() + 1);
        }
      }
    });

    // 2) 돌봄
    careSchedules.forEach((s) => {
      if (!s.date) return;
      const base = new Date(s.date);
      const sTime = dateAtTime(base, s.scheduleTime || "09:00");
      const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
      events.push({
        id: `care-${s.id}`,
        title: `${s.icon || "🐕"} ${s.name}`,
        start: sTime,
        end: eTime,
        allDay: false,
        // 캘린더 필터와 색상 매핑을 위해 돌봄 하위유형(산책/미용/생일)로 설정
        type: s.subType || "산책",
        schedule: { ...s, category: "care" },
      });
    });

    // 3) 접종 일정
    vaccinationSchedules.forEach((s) => {
      const dateStr = s.date || new Date().toISOString().slice(0, 10);
      const base = new Date(dateStr);
      const sTime = dateAtTime(base, s.scheduleTime || "10:00");
      const eTime = new Date(sTime.getTime() + 60 * 60 * 1000);
      events.push({
        id: `vac-${s.id}`,
        title: `${s.icon || "💉"} ${s.name}`,
        start: sTime,
        end: eTime,
        allDay: false,
        // 캘린더 필터와 색상 매핑을 위해 접종 하위유형(예방접종/건강검진)로 설정
        type: s.subType === "건강검진" ? "건강검진" : "예방접종",
        schedule: {
          ...s,
          category: "vaccination",
        },
      });
    });

    return events;
  }, [medications, careSchedules, vaccinationSchedules, dateAtTime]);

  // 통합된 캘린더 이벤트 업데이트
  useEffect(() => {
    const events = buildAllCalendarEvents();
    setAllCalendarEvents(events);
    setMedicalCalendarEvents(events);
  }, [buildAllCalendarEvents]);

  // 실시간 캘린더 이벤트 업데이트를 위한 콜백
  const handleCalendarEventsUpdate = useCallback((newEvents) => {
    setAllCalendarEvents(newEvents);
    setMedicalCalendarEvents(newEvents);
  }, []);

  // 통합된 데이터 업데이트 콜백들
  const handleMedicationsUpdate = useCallback((newMedications) => {
    setMedications(newMedications);
  }, []);

  const handleCareSchedulesUpdate = useCallback((newCareSchedules) => {
    setCareSchedules(newCareSchedules);
  }, []);

  const handleVaccinationSchedulesUpdate = useCallback(
    (newVaccinationSchedules) => {
      setVaccinationSchedules(newVaccinationSchedules);
    },
    []
  );

  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  const handleMedicalCalendarEventClick = (event) => {
    // 캘린더 이벤트 클릭 시 상세 모달 열기
    if (event.schedule) {
      setSelectedSchedule(event.schedule);
      setShowDetailModal(true);
    }
  };

  return (
    <div className="health-page">
      {/* 반려동물 프로필 */}
      <PetProfileSelector
        pets={pets}
        selectedPetName={selectedPetName}
        onSelectPet={setSelectedPetName}
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
        loading={loading}
      />

      {/* 메인 탭: 활동 관리 or 진료/처방 관리 */}
      {activeMainTab === "활동 관리" && (
        <>
          {/* 서브 탭 */}
          <ActivityNavTabs
            activeTab={activeSubTab}
            setActiveTab={setActiveSubTab}
            isCalendarOpen={isCalendarOpen}
            toggleCalendar={toggleCalendar}
          />

          {/* 활동 기록 하위 탭 렌더링 */}
          {activeSubTab === "활동 기록" && <ActivityForm />}
          {activeSubTab === "리포트" && <ActivityReport />}
        </>
      )}

      {activeMainTab === "진료ㆍ처방 관리" && (
        <>
          {/* 진료/처방 관리 서브 탭 */}
          <MedicalNavTabs
            activeTab={medicalSubTab}
            setActiveTab={setMedicalSubTab}
            isCalendarOpen={isCalendarOpen}
            toggleCalendar={toggleCalendar}
            events={allCalendarEvents}
            onEventClick={handleMedicalCalendarEventClick}
          />

          {/* 진료/처방 관리 하위 탭 렌더링 */}
          {medicalSubTab === "투약" && (
            <MedicationManagement
              medications={medications}
              onMedicationsUpdate={handleMedicationsUpdate}
              careSchedules={careSchedules}
              onCareSchedulesUpdate={handleCareSchedulesUpdate}
              vaccinationSchedules={vaccinationSchedules}
              onVaccinationSchedulesUpdate={handleVaccinationSchedulesUpdate}
              onCalendarEventsChange={handleCalendarEventsUpdate}
              showDetailModal={showDetailModal}
              setShowDetailModal={setShowDetailModal}
              selectedSchedule={selectedSchedule}
              setSelectedSchedule={setSelectedSchedule}
            />
          )}
          {medicalSubTab === "돌봄" && (
            <CareManagement
              medications={medications}
              onMedicationsUpdate={handleMedicationsUpdate}
              careSchedules={careSchedules}
              onCareSchedulesUpdate={handleCareSchedulesUpdate}
              vaccinationSchedules={vaccinationSchedules}
              onVaccinationSchedulesUpdate={handleVaccinationSchedulesUpdate}
              onCalendarEventsChange={handleCalendarEventsUpdate}
              showDetailModal={showDetailModal}
              setShowDetailModal={setShowDetailModal}
              selectedSchedule={selectedSchedule}
              setSelectedSchedule={setSelectedSchedule}
            />
          )}
        </>
      )}
    </div>
  );
}
