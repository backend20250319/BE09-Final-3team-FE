"use client";

import React, { useState } from "react";
import PetProfileSelector from "./components/PetProfileSelector";
import { useSelectedPet } from "./context/SelectedPetContext";
import ActivityForm from "./activity/components/ActivityForm";
import ActivityNavTabs from "./activity/components/ActivityNavTabs";
import ActivityReport from "./activity/components/ActivityReport";

export default function HealthPage() {
  const { selectedPetName, setSelectedPetName } = useSelectedPet();

  const pets = [
    { name: "몽글이", msg: "안녕하세요", src: "/user/dog.png" },
    { name: "초코", msg: "반갑습니다", src: "/user/cat.png" },
    { name: "차차", msg: "환영해요", src: "/user/bird.png" },
  ];

  const [activeMainTab, setActiveMainTab] = useState("활동 관리");
  const [activeSubTab, setActiveSubTab] = useState("활동 관리");
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

      {activeMainTab === "진료ㆍ처방 관리" && <MedicalManagementPage />}
    </div>
  );
}
