"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdBusiness } from "react-icons/io";
import NavbarDropdown from "@/app/components/AlarmDropdown";

export default function Header() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const nickname = localStorage.getItem("userNickname");

      if (accessToken) {
        setIsLoggedIn(true);
        setUserNickname(nickname || "");
      } else {
        setIsLoggedIn(false);
        setUserNickname("");
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

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // localStorage에서 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("accessTokenExpiresAt");
    localStorage.removeItem("refreshTokenExpiresAt");

    // 로그인 상태 업데이트
    setIsLoggedIn(false);
    setUserNickname("");

    // 커스텀 이벤트 발생
    window.dispatchEvent(new Event("loginStatusChanged"));

    // 로그인 페이지로 리다이렉트
    router.push("/user/login");
  };

  const navigation = [
    { name: "체험단", href: "/campaign" },
    { name: "펫 관리", href: "/user/management" },
    { name: "SNS 관리", href: "/sns" },
    { name: "건강 관리", href: "/health" },
    { name: "커뮤니티", href: "/community" },
  ];

  return (
    <>
      {/* Top Header */}
      <header className={styles.topHeader}>
        <div className={styles.topHeaderContent}>
          <div className={styles.leftSection}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="PetFul Logo"
                width={200}
                height={200}
              />
            </Link>
          </div>

          <div className={styles.headerActions}>
            <Link href="/advertiser" className={styles.advertiserButton}>
              <IoMdBusiness size={25} />
              <span>광고주</span>
            </Link>

            {isLoggedIn ? (
              // 로그인 상태: 로그아웃 버튼과 마이페이지
              <>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  로그아웃
                </button>
                <Link href="/user/mypage" className={styles.mypageButton}>
                  <Image
                    src="/user/usericon.svg"
                    alt="마이페이지"
                    width={24}
                    height={24}
                  />
                </Link>
              </>
            ) : (
              // 로그아웃 상태: 로그인/회원가입 버튼
              <>
                <Link href="/user/login" className={styles.loginButton}>
                  로그인
                </Link>
                <Link href="/user/signup" className={styles.signupButton}>
                  회원가입
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button className={styles.notificationButton}>
                <div
                  className={styles.notificationIcon}
                  onClick={toggleDropdown}
                >
                  <IoIosNotifications size={24} />
                </div>
                <span className={styles.notificationCount}>
                  {notificationCount}
                </span>
              </button>
            )}

            {isOpen && <NavbarDropdown open={isOpen} />}
          </div>
        </div>
      </header>

      {/* Navigation Header */}
      <nav className={styles.navigation}>
        <div className={styles.navContent}>
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className={styles.navLink}>
              {item.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
