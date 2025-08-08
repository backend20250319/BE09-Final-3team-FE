import Image from "next/image";
import styles from "../styles/CTASection.module.css";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Petful 커뮤니티에 가입할 준비가 되셨나요?
          </h2>
          <p className={styles.ctaDescription}>
            지금 바로 반려동물의 건강을 관리하고, 반려동물의 영향력을
            키워보세요. 이미 수천 명의 반려동물 애호가들이 Petful에 함께하고
            있습니다.
          </p>
          <div className={styles.ctaButtonContainer}>
            <Link href="/user/signup" className={styles.ctaButton}>
              계정만들기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
