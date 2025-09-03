"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdBusiness } from "react-icons/io";
import NavbarDropdown from "@/app/components/AlarmDropdown";
import LoginRequiredModal from "@/components/LoginRequiredModal";

export default function Header() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  // 토큰 갱신 함수
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    const response = await fetch(
      "http://localhost:8000/api/v1/user-service/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("토큰 갱신에 실패했습니다.");
    }

    const data = await response.json();
    if (data.code === "2000" && data.data) {
      const authData = data.data;
      localStorage.setItem("token", authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem("refreshToken", authData.refreshToken);
      }
      if (authData.accessExpiresAt) {
        localStorage.setItem("accessTokenExpiresAt", authData.accessExpiresAt);
      }
      if (authData.refreshExpiresAt) {
        localStorage.setItem(
          "refreshTokenExpiresAt",
          authData.refreshExpiresAt
        );
      }
      return authData.accessToken;
    } else {
      throw new Error(data.message || "토큰 갱신 응답이 올바르지 않습니다.");
    }
  };

  // 토큰 상태 확인 및 갱신
  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem("token");
    const refreshTokenValue = localStorage.getItem("refreshToken");

    if (token && refreshTokenValue) {
      try {
        // 토큰 유효성 검사
        const response = await fetch(
          "http://localhost:8000/api/v1/user-service/auth/validate-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!data.data) {
          // 토큰이 유효하지 않으면 갱신 시도
          await refreshToken();
        }
      } catch (error) {
        console.error("토큰 검증/갱신 실패:", error);
        // 갱신 실패 시 로그아웃
        localStorage.clear();
        setIsLoggedIn(false);
        setUserNickname("");
      }
    }
  };

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const token = localStorage.getItem("token");
      const nickname = localStorage.getItem("userNickname");

      if (accessToken || token) {
        setIsLoggedIn(true);
        setUserNickname(nickname || "");
      } else {
        setIsLoggedIn(false);
        setUserNickname("");
      }
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 주기적으로 로그인 상태 확인 (1초마다)
    const intervalId = setInterval(checkLoginStatus, 1000);

    // 5분마다 토큰 상태 확인 및 갱신
    const tokenCheckInterval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // localStorage 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 시)
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      clearInterval(intervalId);
      clearInterval(tokenCheckInterval);
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
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userNo");
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

  // 네비게이션 링크 클릭 핸들러
  const handleNavigationClick = (e, serviceName, href) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setSelectedService(serviceName);
      setShowLoginModal(true);
      return;
    }
    // 로그인된 경우 정상적으로 이동
    router.push(href);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setSelectedService("");
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
            <a
              key={item.name}
              href={item.href}
              className={styles.navLink}
              onClick={(e) => handleNavigationClick(e, item.name, item.href)}
            >
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      {/* 로그인 필요 모달 */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        serviceName={selectedService}
      />
    </>
  );
}
