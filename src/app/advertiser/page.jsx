import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import DetailedFeaturesSection from "./components/DetailedFeaturesSection";
import CTASection from "./components/CTASection";
import styles from "../styles/MainPage.module.css";
import InfluencerSection from "../components/InfluencerSection";

export default function Page() {
  return (
    <div className={styles.mainPage}>
      <main className={styles.mainContent}>
        <HeroSection />
        <FeaturesSection />
        <DetailedFeaturesSection />
        <InfluencerSection />
        <CTASection />
      </main>
    </div>
  );
}
