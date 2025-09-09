"use client";

import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import DetailedFeaturesSection from "./components/DetailedFeaturesSection";
import CTASection from "./components/CTASection";
import styles from "../styles/MainPage.module.css";
import InfluencerSection from "../components/InfluencerSection";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
    
    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const token = localStorage.getItem("advertiserToken");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    
    // 로컬 스토리지 변경 감지
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <DetailedFeaturesSection />
        <InfluencerSection />
        <CTASection />
      </main>
    </div>
  );
}
