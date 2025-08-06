"use client";

import PetProfileSelector from "../components/PetProfileSelector";
import { useSelectedPet } from "../context/SelectedPetContext";
import ActivityForm from "../activity/components/ActivityForm";

export default function ActivityManagementPage() {
  const { selectedPetName, setSelectedPetName } = useSelectedPet();

  const pets = [
    { name: "몽글이", msg: "안녕하세요", src: "/images/mong-profile.png" },
    { name: "초코", msg: "반갑습니다", src: "/images/choco-profile.png" },
    { name: "차차", msg: "환영해요", src: "/images/chacha-profile.png" },
  ];

  return (
    <>
      {/* 반려동물 프로필 */}
      <PetProfileSelector
        pets={pets}
        selectedPetName={selectedPetName}
        onSelectPet={setSelectedPetName}
      />

      {/* 활동 관리 */}
      <ActivityForm />
    </>
  );
}
