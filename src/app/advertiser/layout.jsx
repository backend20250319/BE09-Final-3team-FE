"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import styles from "./styles/SideBar.module.css";
import Header from "./components/Header";
import { ImageProvider } from "./context/ImageContext";

export default function RootLayout({ children }) {
  const pathname = usePathname() || "/";

  // 사이드바 숨길 경로
  const noSidebarPrefixes = [
    "/advertiser/login",
    "/advertiser/signup",
    "/advertiser/passwordfind",
  ];

  const shouldHideSidebar =
    pathname === "/advertiser" ||
    noSidebarPrefixes.some((p) => pathname.startsWith(p));

  return (
    <>
      <ImageProvider>
        <Header />
        {/* 화면 공통 배경 */}
        <div className={styles.pageBg}>
          {shouldHideSidebar ? (
            // 로그인/회원가입/비번찾기/광고주 홈: 사이드바 없이
            <main className={styles.contentOnly}>{children}</main>
          ) : (
            // 그 외: 사이드바 포함
            <div className={styles.container}>
              <Sidebar />
              <main className={styles.main}>{children}</main>
            </div>
          )}
        </div>
      </ImageProvider>
    </>
  );
}
