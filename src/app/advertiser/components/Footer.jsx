import styles from "../styles/Footer.module.css";
import { FiBell, FiInstagram, FiYoutube, FiFacebook } from "react-icons/fi";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brandSection}>
            <p className={styles.description}>
              예비·펫 인플루언서와 광고주를 연결하는 반려동물 건강 관리 & 마케팅
              통합 플랫폼
            </p>
            <div className={styles.logo}>
              <Image
                src="/petful-logo.png"
                alt="PetFul"
                width={108}
                height={108}
                className={styles.logoImage}
              />
            </div>
            <div className={styles.divider} />
          </div>

          <div className={styles.socialMedia}>
            <FiBell size={20} />
            <FiInstagram size={20} />
            <FiYoutube size={20} />
            <FiFacebook size={20} />
          </div>
        </div>

        <p className={styles.copyright}>
          © 2025 몽글몽글. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
