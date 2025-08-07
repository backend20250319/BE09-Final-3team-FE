"use client";

import React, { useState } from "react";
import PetProfileSelector from "../components/PetProfileSelector";
import { useSelectedPet } from "../context/SelectedPetContext";
import ActivityForm from "../activity/components/ActivityForm";
import ActivityNavTabs from "./components/ActivityNavTabs";
import ActivityReport from "./components/ActivityReport";

export default function ActivityManagementPage() {
  const { selectedPetName, setSelectedPetName } = useSelectedPet();

  const pets = [
    { name: "몽글이", msg: "안녕하세요", src: "/images/mong-profile.png" },
    { name: "초코", msg: "반갑습니다", src: "/images/choco-profile.png" },
    { name: "차차", msg: "환영해요", src: "/images/chacha-profile.png" },
  ];

  const [activeTab, setActiveTab] = useState("activity");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const toggleCalendar = () => setIsCalendarOpen((prev) => !prev);

  return (
    <>
      {/* 반려동물 프로필 */}
      <PetProfileSelector
        pets={pets}
        selectedPetName={selectedPetName}
        onSelectPet={setSelectedPetName}
      />

      {/* 네비게이션 탭 */}
      <ActivityNavTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCalendarOpen={isCalendarOpen}
        toggleCalendar={toggleCalendar}
      />

      {/* 탭에 따른 화면 렌더링 */}
      {activeTab === "활동 관리" && <ActivityForm />}
      {activeTab === "리포트" && <ActivityReport />}
    </>
  );
}
