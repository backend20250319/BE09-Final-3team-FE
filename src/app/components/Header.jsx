"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdBusiness } from "react-icons/io";
import NavbarDropdown from "@/app/components/AlarmDropdown";
import LoginRequiredModal from "@/app/components/LoginRequiredModal";
import { getUnreadNotificationCount } from "@/api/notificationApi";
import {
  getCurrentUserType,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  getTokenStatus,
  clearTokens,
  saveTokens,
  USER_TYPES,
  getTokenKeys,
  needsTokenRefresh,
  isTokenExpired
} from "@/utils/tokenManager";
import api from "../../api/api";

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
    const currentUserType = getCurrentUserType();
    const refreshTokenValue = getCurrentRefreshToken();
    
    if (!refreshTokenValue) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    const response = await api.post("/user-service/auth/refresh", {
      refreshToken: refreshTokenValue,
    });

    if (!response.status === 200) {
      throw new Error("토큰 갱신에 실패했습니다.");
    }

    const data = response.data;
    if (data.code === "2000" && data.data) {
      const authData = data.data;
      
      // 새로운 토큰 매니저를 사용하여 저장
      saveTokens(currentUserType, {
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        accessExpiresAt: authData.accessExpiresAt,
        refreshExpiresAt: authData.refreshExpiresAt
      });
      
      return authData.accessToken;
    } else {
      throw new Error(data.message || "토큰 갱신 응답이 올바르지 않습니다.");
    }
  };

  // 토큰 상태 확인 및 갱신 (시간 기반)
  const checkAndRefreshToken = async () => {
    try {
      // 토큰 상태 디버깅 정보 출력
      const tokenStatus = getTokenStatus();
      console.log("🔍 토큰 상태:", tokenStatus);

      // 유효한 토큰이 없으면 로그아웃 처리
      if (!hasValidToken()) {
        console.warn("❌ 유효한 토큰이 없어 로그아웃 처리");
        handleTokenExpired();
        return;
      }

      // 토큰 갱신이 필요한 경우에만 갱신 시도
      if (needsTokenRefresh()) {
        console.log("🔄 토큰 갱신 필요, 갱신 시도...");
        await refreshToken();
        console.log("✅ 토큰 갱신 완료");
      }
    } catch (error) {
      console.error("❌ 토큰 검증/갱신 실패:", error);
      // 갱신 실패 시 로그아웃 처리
      handleTokenExpired();
    }
  };

  // 토큰 만료 시 로그아웃 처리
  const handleTokenExpired = () => {
    console.log("🚪 토큰 만료로 인한 로그아웃 처리");
    clearTokens(); // 새로운 토큰 매니저 사용
    setIsLoggedIn(false);
    setUserNickname("");
    setNotificationCount(0);

    // 커스텀 이벤트 발생
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  // 안읽은 알림 갯수 가져오기
  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationCount();
      setNotificationCount(count);
    } catch (error) {
      // 로그 레벨을 줄임 (에러만 표시)
      if (error.message && !error.message.includes("401")) {
        console.error("알림 갯수 가져오기 실패:", error);
      }
      setNotificationCount(0);
    }
  };

  // 로그인 상태 확인 (토큰 만료 시간 고려)
  useEffect(() => {
    const checkLoginStatus = () => {
      const userType = getCurrentUserType();
      const tokenKeys = getTokenKeys(userType);
      
      // 토큰 기반으로 로그인 상태 확인
      if (userType && getCurrentAccessToken()) {
        const nickname = localStorage.getItem(tokenKeys.NICKNAME) || localStorage.getItem(tokenKeys.EMAIL) || "";
        setIsLoggedIn(true);
        setUserNickname(nickname);
        // 로그인 시 안읽은 알림 갯수 가져오기
        fetchUnreadCount();
      } else {
        setIsLoggedIn(false);
        setUserNickname("");
        setNotificationCount(0);
      }
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인 상태 확인 주기를 5초로 조정 (1초는 너무 빈번함)
    const intervalId = setInterval(checkLoginStatus, 5000);

    // 토큰 상태 확인을 15분으로 조정 (5분은 너무 빈번함)
    // 단, 토큰 만료 시간을 고려한 스마트한 검증
    const tokenCheckInterval = setInterval(
      checkAndRefreshToken,
      15 * 60 * 1000
    );

    // 1분마다 안읽은 알림 갯수 갱신 (30초는 너무 빈번함)
    const notificationInterval = setInterval(() => {
      if (isLoggedIn) {
        fetchUnreadCount();
      }
    }, 60000);

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
      clearInterval(notificationInterval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, [isLoggedIn]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // 토큰 유틸리티를 사용해 모든 토큰 정보 삭제
    clearTokens(); // 새로운 토큰 매니저 사용

    // 로그인 상태 업데이트
    setIsLoggedIn(false);
    setUserNickname("");
    setNotificationCount(0);

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
                  {notificationCount > 0 && (
                    <span className={styles.notificationBadge}>
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {isOpen && (
              <NavbarDropdown
                open={isOpen}
                onNotificationDeleted={fetchUnreadCount}
              />
            )}
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
