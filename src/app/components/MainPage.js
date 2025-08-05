import styles from "../styles/MainPage.module.css";
import Header from "./Header";
import HeroIntro from "./HeroIntro";
import HeroSection from "./HeroSection";
import FeatureCards from "./FeatureCards";
import CampaignSection from "./CampaignSection";
import InfluencerSection from "./InfluencerSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function MainPage() {
  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <HeroIntro />
        <HeroSection />
        <FeatureCards />
        <CampaignSection />
        <InfluencerSection />
        <CTASection />

        {/* Main CTA Section */}
      </main>
    </div>
  );
}
