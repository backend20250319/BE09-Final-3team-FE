"use client";
import { createContext, useContext, useState } from "react";

const SnsContext = createContext();

export function SnsProvider({ children }) {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <SnsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </SnsContext.Provider>
  );
}

export function useSns() {
  const context = useContext(SnsContext);
  if (!context) {
    throw new Error("useSns must be used within SnsProvider");
  }
  return context;
}
