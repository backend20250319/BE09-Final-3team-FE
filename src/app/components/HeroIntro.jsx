"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiLogIn } from "react-icons/fi";
import styles from "../styles/HeroIntro.module.css";

export default function HeroIntro() {

  const router = useRouter();

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
            <button className={styles.dashboardButton} onClick={() => router.push("/user/login")}>
              <div className={styles.dashboardIcon}>
                <FiLogIn size={18} color="#8A9C6E" />
              </div>
              Login to Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
