import Image from "next/image";
import styles from "../styles/HeroSection.module.css";
import { FiLogIn } from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
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
        <div className={styles.container}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              PetFul에서 반려동물 인플루언서와 소통하며 <br />
              비즈니스를 성장시켜보세요</h2>
            <p className={styles.subtitle}>
              수많은 광고주들이 펫풀(Petful)과 함께
              <br />
              다양한 콘텐츠와 캠페인으로 브랜드를 알려가고 있습니다
            </p>
          </div>

          <button className={styles.dashboardBtn}>
            <FiLogIn size={18} />
            <span>Login to Dashboard</span>
          </button>
        </div>
      </div>
    </section>
  );
}
