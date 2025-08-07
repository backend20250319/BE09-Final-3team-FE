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
            <h1 className={styles.title}>광고주님 환영합니다!</h1>
            <p className={styles.subtitle}>
              Petful에서 반려동물 SNS 활동자와 소통하고 티켓팅 광고를 통해
              비즈니스를
              <br />
              성장시킬 수 있는 여러가지 컨텐츠가 있습니다.
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
