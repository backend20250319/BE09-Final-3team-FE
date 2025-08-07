import styles from "../styles/Header.module.css";
import { IoIosNotifications } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.topHeader}>
      <div className="container">
        <div className={styles.topHeaderContent}>
          <Link href="/advertiser" className={styles.logo}>
            <Image src="/logo.png" alt="PetFul Logo" width={200} height={200} />
          </Link>

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
