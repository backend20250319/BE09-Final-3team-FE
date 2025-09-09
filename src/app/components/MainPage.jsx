"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "../styles/MainPage.module.css";
import HeroIntro from "./HeroIntro.jsx";
import HeroSection from "./HeroSection.jsx";
import FeatureCards from "./FeatureCards.jsx";
import CampaignSection from "./CampaignSection.jsx";
import InfluencerSection from "./InfluencerSection.jsx";
import CTASection from "./CTASection.jsx";
import api from "../../api/api";

export default function MainPage() {
  // 토큰 갱신 함수
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return;
    }

    try {
      const response = await api.post("/user-service/auth/refresh", {
        refreshToken,
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.code === "2000" && data.data) {
          const authData = data.data;
          localStorage.setItem("token", authData.accessToken);
          if (authData.refreshToken) {
            localStorage.setItem("refreshToken", authData.refreshToken);
          }
          if (authData.accessExpiresAt) {
            localStorage.setItem(
              "accessTokenExpiresAt",
              authData.accessExpiresAt
            );
          }
          if (authData.refreshExpiresAt) {
            localStorage.setItem(
              "refreshTokenExpiresAt",
              authData.refreshExpiresAt
            );
          }
          console.log("토큰이 자동으로 갱신되었습니다.");
        }
      }
    } catch (error) {
      console.error("자동 토큰 갱신 실패:", error);
    }
  };

  // 자동 토큰 갱신 설정
  const setupAutoTokenRefresh = () => {
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem("token");
      const refreshTokenValue = localStorage.getItem("refreshToken");

      if (token && refreshTokenValue) {
        try {
          // 토큰 유효성 검사
          const response = await api.post("/user-service/auth/validate-token");

          const data = response.data;
          if (!data.data) {
            // 토큰이 유효하지 않으면 갱신 시도
            await refreshToken();
          }
        } catch (error) {
          console.error("토큰 검증/갱신 실패:", error);
        }
      }
    };

    // 5분마다 토큰 상태 확인 및 갱신
    const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // 페이지 언로드 시 인터벌 정리
    window.addEventListener("beforeunload", () => {
      clearInterval(intervalId);
    });

    return intervalId;
  };

  useEffect(() => {
    AOS.init();

    // 자동 토큰 갱신 설정
    const intervalId = setupAutoTokenRefresh();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <HeroIntro />
        <FeatureCards />
        <HeroSection />
        <CampaignSection />
        <InfluencerSection />
        <CTASection />
      </main>
    </div>
  );
}
