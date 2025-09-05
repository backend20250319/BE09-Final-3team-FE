"use client";
import { createContext, useContext, useState } from "react";

const campaignContext = createContext();

export function CampaignProvider({ children }) {
  const [activeTab, setActiveTab] = useState("approved");

  return (
    <campaignContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </campaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(campaignContext);
  if (!context) {
    throw new Error("useCampaign이 useProvider로 감싸지지 않은 상태로 사용하여 에러 발생");
  }
  return context;
}