"use client";

import React, { useState } from "react";
import PetProfileSelector from "./components/PetProfileSelector";
import { useSelectedPet } from "./context/SelectedPetContext";
import ActivityForm from "./activity/components/ActivityManagement";
import ActivityNavTabs from "./activity/components/ActivityNavTabs";
import ActivityReport from "./activity/components/ActivityReport";
import MedicalNavTabs from "./medical/components/MedicalNavTabs";
import MedicationManagement from "./medical/components/MedicationManagement";
import CareSchedule from "./medical/components/CareSchedule";

export default function HealthPage() {
  const { selectedPetName, setSelectedPetName } = useSelectedPet();

  const pets = [
    { name: "몽글이", msg: "안녕하세요", src: "/user/dog.png" },
    { name: "초코", msg: "반갑습니다", src: "/user/cat.png" },
    { name: "차차", msg: "환영해요", src: "/user/bird.png" },
  ];

  const [activeMainTab, setActiveMainTab] = useState("활동 관리");
  const [activeSubTab, setActiveSubTab] = useState("활동 관리");
  const [medicalSubTab, setMedicalSubTab] = useState("투약");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  return (
    <div className="health-page">
      {/* 반려동물 프로필 */}
      <PetProfileSelector
        pets={pets}
        selectedPetName={selectedPetName}
        onSelectPet={setSelectedPetName}
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
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

          {/* 활동 관리 하위 탭 렌더링 */}
          {activeSubTab === "활동 관리" && <ActivityForm />}
          {activeSubTab === "리포트" && <ActivityReport />}
        </>
      )}

      {activeMainTab === "진료ㆍ처방 관리" && (
        <>
          {/* 진료/처방 관리 서브 탭 (MedicalNavTabs 컴포넌트로 구현되어 있으면 그대로 쓰면 됩니다) */}
          <MedicalNavTabs
            activeTab={medicalSubTab}
            setActiveTab={setMedicalSubTab}
          />

          {/* 진료/처방 관리 하위 탭 렌더링 */}
          {medicalSubTab === "투약" && <MedicationManagement />}
          {medicalSubTab === "돌봄 일정" && <CareSchedule />}
        </>
      )}
    </div>
  );
}
