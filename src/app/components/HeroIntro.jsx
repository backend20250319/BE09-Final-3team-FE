"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiLogIn } from "react-icons/fi";
import styles from "../styles/HeroIntro.module.css";

export default function HeroIntro() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const token = localStorage.getItem("token");
      
      if (accessToken || token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
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

  return (
    <section className={styles.heroIntroSection}>
      <div className={styles.heroBackground}>
        <Image
          src="/hero-background.jpg"
          alt="Hero Background"
          width={1440}
          height={563}
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundOverlay}></div>
      </div>

      <div className={styles.heroContent}>
        <div className="container">
          <div className={styles.heroTextContent}>
            <h2 className={styles.heroTitle}>
              PetFul 에서 반려 동물과의<br />
              새로운 디지털 라이프를 시작해보세요
            </h2>
            <p className={styles.heroDescription}>
              수천 명의 반려인들이 펫풀(Petful)과 함께
              <br />
              상품 체험부터 반려동물의 건강 및 SNS 관리까지 누리고 있습니다.
            </p>
            {!isLoggedIn && (
              <button className={styles.dashboardButton} onClick={() => router.push("/user/login")}>
                <div className={styles.dashboardIcon}>
                  <FiLogIn size={18} color="#8A9C6E" />
                </div>
                Login to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
