"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdHome } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [advertiserEmail, setAdvertiserEmail] = useState("");

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const advertiserToken = localStorage.getItem("advertiserToken");
      const email = localStorage.getItem("advertiserEmail");

      if (advertiserToken) {
        setIsLoggedIn(true);
        setAdvertiserEmail(email || "");
      } else {
        setIsLoggedIn(false);
        setAdvertiserEmail("");
      }
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    // localStorage에서 토큰 제거
    localStorage.removeItem("advertiserToken");
    localStorage.removeItem("advertiserEmail");

    // 로그인 상태 업데이트
    setIsLoggedIn(false);
    setAdvertiserEmail("");

    // 커스텀 이벤트 발생
    window.dispatchEvent(new Event("loginStatusChanged"));

    // 광고주 로그인 페이지로 리다이렉트
    router.push("/advertiser/login");
  };

  return (
    <header className={styles.topHeader}>
      <div className="container">
        <div className={styles.topHeaderContent}>
          <div className={styles.leftSection}>
            <Link href="/advertiser" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="PetFul Logo"
                width={200}
                height={200}
              />
            </Link>
          </div>

          <div className={styles.headerActions}>
            <Link href="/" className={styles.homeButton}>
              <IoMdHome size={25} />
              <span>인플루언서</span>
            </Link>

            {isLoggedIn ? (
              // 로그인 상태: 로그아웃 버튼만
              <>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  로그아웃
                </button>
              </>
            ) : (
              // 로그아웃 상태: 로그인/회원가입 버튼
              <>
                <Link href="/advertiser/login" className={styles.loginButton}>
                  로그인
                </Link>
                <Link href="/advertiser/signup" className={styles.signupButton}>
                  회원가입
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button className={styles.notificationButton}>
                <div className={styles.notificationIcon}>
                  <IoIosNotifications size={24} />
                </div>
                <span className={styles.notificationCount}>0</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
