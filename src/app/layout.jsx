"use client";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAdvertiser = pathname.startsWith("/advertiser");
  return (
    <html lang="en">
      <head>
        <title>PetFul</title>
        <meta
          name="description"
          content="예비·펫 인플루언서와 광고주를 연결하는 반려동물 건강 관리 & 마케팅 통합 플랫폼"
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
      </head>
      <body>
        {!isAdmin && !isAdvertiser && <Header />}
        {isAdmin ? children : <div className="pageWrapper">{children}</div>}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
