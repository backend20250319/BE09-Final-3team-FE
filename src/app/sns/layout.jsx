"use client";
import SubHeader from "../components/SubHeader";
import TabNavigation from "./components/TabNavigation";
import { SnsProvider } from "./context/SnsContext";

export default function SnsLayout({ children }) {
  return (
    <SnsProvider>
      <SubHeader
        title="SNS 관리"
        subtitle="회원님의 SNS를 간편하고 효율적으로 관리하세요."
      />
      <TabNavigation />

      {/* 페이지 컨텐츠 */}
      <main>{children}</main>
    </SnsProvider>
  );
}
