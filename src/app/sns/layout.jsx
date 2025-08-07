"use client";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import { SnsProvider } from "./context/SnsContext";

export default function SnsLayout({ children }) {
  return (
    <SnsProvider>
      {/* Header */}
      <Header />
      <TabNavigation />

      {/* 페이지 컨텐츠 */}
      <main>{children}</main>
    </SnsProvider>
  );
}
