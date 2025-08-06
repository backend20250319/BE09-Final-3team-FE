"use client";

import React, { createContext, useState, useContext } from "react";

const SelectedPetContext = createContext();

export function SelectedPetProvider({ children }) {
  const [selectedPetName, setSelectedPetName] = useState("몽글이");

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
