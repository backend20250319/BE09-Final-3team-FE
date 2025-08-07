"use client";
import SubHeader from "../components/SubHeader";
import TabNavigation from "./components/TabNavigation";
import { CampaignProvider } from "./context/CampaignContext";

export default function campaignLayout({ children }) {
  return (
    <CampaignProvider>
      {/* Header */}
      <SubHeader title="체험단" subtitle="반려동물과 함께하는 특별한 상품 체험, 지금 바로 신청하고 경험해보세요" />
      <TabNavigation />

      {/* 페이지 컨텐츠 */}
      <main>{children}</main>
    </CampaignProvider>
  );
}
