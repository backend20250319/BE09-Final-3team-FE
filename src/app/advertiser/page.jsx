import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import DetailedFeaturesSection from "./components/DetailedFeaturesSection";
import InfluencersSection from "./components/InfluencersSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import styles from "../styles/MainPage.module.css";

export default function Page() {
  return (
    <div className={styles.mainPage}>
      <main className="{styles.mainContent}">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <DetailedFeaturesSection />
        <InfluencersSection />
        <CTASection />
        {/* <Footer /> */}
      </main>
    </div>
  );
}
