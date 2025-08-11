"use client";

import styles from "../styles/MainPage.module.css";
import HeroIntro from "./HeroIntro.jsx";
import HeroSection from "./HeroSection.jsx";
import FeatureCards from "./FeatureCards.jsx";
import CampaignSection from "./CampaignSection.jsx";
import InfluencerSection from "./InfluencerSection.jsx";
import CTASection from "./CTASection.jsx";

export default function MainPage() {
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
