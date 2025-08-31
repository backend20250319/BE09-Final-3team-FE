import React, { createContext, useState, useContext, useEffect } from "react";
import { getPetActivityStats } from "../../../api/activityApi";

const SelectedPetContext = createContext();

export function SelectedPetProvider({ children }) {
  const [selectedPetName, setSelectedPetName] = useState("");
  const [selectedPetNo, setSelectedPetNo] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  // 사용자의 펫 목록 가져오기
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const petsData = await getPetActivityStats();
        console.log("백엔드에서 받은 펫 데이터:", petsData);
        if (petsData && Array.isArray(petsData)) {
          setPets(petsData);

          // 저장된 펫 이름이 있으면 해당 펫의 petNo 찾기
          const savedPetName = localStorage.getItem("selectedPetName");
          if (savedPetName) {
            const savedPet = petsData.find((pet) => pet.name === savedPetName);
            if (savedPet) {
              setSelectedPetName(savedPetName);
              setSelectedPetNo(savedPet.petNo);
            }
          } else if (petsData.length > 0) {
            // 저장된 펫이 없으면 petNo 오름차순으로 정렬하여 가장 낮은 petNo 선택
            const sortedPets = [...petsData].sort((a, b) => a.petNo - b.petNo);
            const firstPet = sortedPets[0];
            console.log(
              `자동 선택된 펫: ${firstPet.name} (petNo: ${firstPet.petNo})`
            );
            setSelectedPetName(firstPet.name);
            setSelectedPetNo(firstPet.petNo);
            localStorage.setItem("selectedPetName", firstPet.name);
          }
        }
      } catch (error) {
        console.error("펫 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // 선택된 펫 이름이 변경되면 해당 펫의 petNo 찾기
  useEffect(() => {
    if (selectedPetName && pets.length > 0) {
      const selectedPet = pets.find((pet) => pet.name === selectedPetName);
      if (selectedPet) {
        console.log(
          `사용자 선택: ${selectedPet.name} (petNo: ${selectedPet.petNo})`
        );
        setSelectedPetNo(selectedPet.petNo);
        localStorage.setItem("selectedPetName", selectedPetName);
      }
    }
  }, [selectedPetName, pets]);

  return (
    <SelectedPetContext.Provider
      value={{
        selectedPetName,
        setSelectedPetName,
        selectedPetNo,
        pets,
        loading,
      }}
    >
      {children}
    </SelectedPetContext.Provider>
  );
}

export function useSelectedPet() {
  return useContext(SelectedPetContext);
}
