"use client";
import { CampaignProvider } from "./context/CampaignContext";

export default function campaignLayout({ children }) {
  return (
    <CampaignProvider>
      {/* 페이지 컨텐츠 */}
      <main>{children}</main>
    </CampaignProvider>
  );
}
