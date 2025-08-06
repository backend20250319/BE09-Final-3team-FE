import React, { createContext, useState, useContext, useEffect } from "react";

const SelectedPetContext = createContext();

export function SelectedPetProvider({ children }) {
  const [selectedPetName, setSelectedPetName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("selectedPetName");
    if (saved) {
      setSelectedPetName(saved);
    }
  }, []);

  useEffect(() => {
    if (selectedPetName) {
      localStorage.setItem("selectedPetName", selectedPetName);
    }
  }, [selectedPetName]);

  return (
    <SelectedPetContext.Provider
      value={{ selectedPetName, setSelectedPetName }}
    >
      {children}
    </SelectedPetContext.Provider>
  );
}

export function useSelectedPet() {
  return useContext(SelectedPetContext);
}
