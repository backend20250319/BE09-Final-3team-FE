import styles from "../styles/Header.module.css";
import { IoIosNotifications, IoMdHome } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.topHeader}>
      <div className="container">
        <div className={styles.topHeaderContent}>
          <div className={styles.leftSection}>
            <Link href="/advertiser" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="PetFul Logo"
                width={200}
                height={200}
              />
            </Link>
            <Link href="/" className={styles.homeButton}>
              <IoMdHome size={20} />
              <span>메인</span>
            </Link>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.loginButton}>로그인</button>
            <button className={styles.signupButton}>회원가입</button>
            <button className={styles.notificationButton}>
              <div className={styles.notificationIcon}>
                <IoIosNotifications size={24} />
              </div>
              <span className={styles.notificationCount}>0</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
