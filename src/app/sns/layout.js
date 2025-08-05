"use client";
import Head from "next/head";
import Header from "./components/Header";
import TabNavigation from "./components/TabNavigation";
import { SnsProvider } from "./context/SnsContext";

export default function SnsLayout({ children }) {
  return (
    <SnsProvider>
      <Head>
        <title>SNS 관리 - PetFul</title>
        <meta
          name="description"
          content="반려동물 SNS 계정 관리 및 분석 대시보드"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <Header />
      <TabNavigation />

      {/* 페이지 컨텐츠 */}
      <main>{children}</main>
    </SnsProvider>
  );
}
