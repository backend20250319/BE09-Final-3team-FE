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

export default function MainPage() {

  useEffect(() => {
    AOS.init();
  },[])

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
