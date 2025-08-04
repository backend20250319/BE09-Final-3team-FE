import Image from "next/image";
import styles from "../styles/CTASection.module.css";

export default function CTASection() {
  return (
    <>
      {/* Main CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Petful 커뮤니티에 가입할 준비가 되셨나요?
            </h2>
            <p className={styles.ctaDescription}>
              지금 바로 반려동물의 건강을 관리하고, 반려동물의 영향력을 키워보세요.
              이미 수천 명의 반려동물 애호가들이 Petful에 함께하고 있습니다.
            </p>
            <div className={styles.ctaButtonContainer}>
              <button className={styles.ctaButton}>
                계정 만들기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA Section with Background */}
      <section className={styles.heroCtaSection}>
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
                PetFul 에서 반려 동물과의
                새로운 디지털 라이프를 시작해보세요
              </h2>
              <p className={styles.heroDescription}>
                수천 명의 반려인들이 펫풀(Petful)과 함께 반려동물의 건강, 소셜미디어, 커뮤니티 관리를
                신뢰하고 있습니다.
              </p>
              <button className={styles.dashboardButton}>
                <div className={styles.dashboardIcon}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 1.125L11.25 6.375L17.25 6.375L12.75 10.125L15 15.375L9 11.625L3 15.375L5.25 10.125L0.75 6.375L6.75 6.375L9 1.125Z"
                      fill="#8A9C6E"
                    />
                  </svg>
                </div>
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}